import "./env.js";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { connectMongo, getMongoStatus } from "./mongo.js";
import { User, Lot, Order, FieldPlan } from "./models.js";
import { CROP_IMAGES, CROP_PROFILES, REGION_COORDS, calculateFieldMetrics, ensureSeedData } from "./seed.js";
import { getAdminEmail, optionalAuth, requireAdmin, requireAuth } from "./firebaseAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(optionalAuth);

async function requireDb(_req, _res, next) {
  const ok = await connectMongo();
  if (!ok) {
    const err = new Error("MONGODB_URI sozlanmagan");
    err.status = 503;
    throw err;
  }
  await ensureSeedData();
  next();
}

function sanitizeOrderForUser(order, isAdmin) {
  if (isAdmin) return order;
  const { platformFee: _hiddenFee, ...safeOrder } = order;
  return safeOrder;
}

app.get("/api/health", async (_req, res) => {
  try {
    await connectMongo();
  } catch (err) {
    return res.status(200).json({
      ok: true,
      mongo: "disconnected",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
  res.json({
    ok: true,
    mongo: getMongoStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/crops", (_req, res) => {
  res.json({ crops: CROP_PROFILES });
});

app.post("/api/users/sync", requireDb, async (req, res) => {
  const authUser = req.authUser;
  const uid = authUser?.uid || req.body.uid;
  const email = (authUser?.email || req.body.email || "").trim().toLowerCase();
  const displayName = String(req.body.displayName || authUser?.name || "").trim();
  const photoURL = String(req.body.photoURL || authUser?.picture || "");
  const provider = String(req.body.provider || "password");

  if (!uid || !email) {
    return res.status(400).json({ error: "uid va email majburiy" });
  }

  let user = await User.findOne({ $or: [{ uid: String(uid) }, { email }] });
  if (user) {
    user.uid = String(uid);
    user.email = email;
    if (displayName) user.displayName = displayName;
    if (photoURL) user.photoURL = photoURL;
    user.provider = provider;
    user.lastLoginAt = new Date();
    await user.save();
    user = user.toObject();
  } else {
    user = (
      await User.create({
        uid: String(uid),
        email,
        displayName,
        photoURL,
        provider,
        subscriptionPlan: "free",
        lastLoginAt: new Date(),
      })
    ).toObject();
  }

  const adminEmail = getAdminEmail();
  res.json({
    user,
    isAdmin: Boolean(adminEmail && email === adminEmail),
  });
});

app.post("/api/users/subscription", requireDb, requireAuth, async (req, res) => {
  const plan = req.body.plan === "free" ? "free" : "pro";
  const user = await User.findOneAndUpdate(
    { uid: req.authUser.uid },
    {
      $set: {
        subscriptionPlan: plan,
        subscriptionUpdatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  ).lean();

  if (!user) {
    return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
  }

  res.json({ user });
});

app.get("/api/admin/users", requireDb, requireAdmin, async (_req, res) => {
  const [users, lots] = await Promise.all([
    User.find().sort({ createdAt: -1 }).lean(),
    Lot.find().select("ownerUid ownerEmail quantityTons soldTons").lean(),
  ]);

  const enriched = users.map((u) => {
    const owned = lots.filter(
      (l) => l.ownerUid === u.uid || (l.ownerEmail && l.ownerEmail === u.email)
    );
    return {
      ...u,
      lotsCount: owned.length,
      remainingTons: Number(owned.reduce((s, l) => s + (l.quantityTons || 0), 0).toFixed(1)),
      soldTons: Number(owned.reduce((s, l) => s + (l.soldTons || 0), 0).toFixed(1)),
    };
  });

  res.json({ users: enriched });
});

app.patch("/api/admin/users/:id/subscription", requireDb, requireAdmin, async (req, res) => {
  const plan = req.body.plan === "free" ? "free" : "pro";
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        subscriptionPlan: plan,
        subscriptionUpdatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  ).lean();

  if (!user) {
    return res.status(404).json({ error: "Fermer topilmadi" });
  }

  res.json({ user });
});

app.post("/api/admin/users/grant-pro", requireDb, requireAdmin, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const plan = req.body.plan === "free" ? "free" : "pro";
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "To'g'ri email kiriting" });
  }

  let user = await User.findOne({ email });
  if (user) {
    user.subscriptionPlan = plan;
    user.subscriptionUpdatedAt = new Date();
    await user.save();
    user = user.toObject();
  } else {
    user = (
      await User.create({
        uid: `pending:${email}`,
        email,
        displayName: email.split("@")[0],
        provider: "admin-granted",
        subscriptionPlan: plan,
        subscriptionUpdatedAt: new Date(),
      })
    ).toObject();
  }

  res.json({ user });
});

app.get("/api/dashboard", requireDb, async (req, res) => {
  const authUser = req.authUser;
  const isAdmin = Boolean(authUser?.isAdmin);

  const [lots, orders, plans, proSubscribers] = await Promise.all([
    Lot.find().lean(),
    Order.find().sort({ createdAt: -1 }).lean(),
    FieldPlan.find().sort({ createdAt: -1 }).lean(),
    isAdmin ? User.countDocuments({ subscriptionPlan: "pro" }) : Promise.resolve(0),
  ]);

  const totalTonsAvailable = Number(
    lots.reduce((sum, lot) => sum + (lot.quantityTons || 0), 0).toFixed(1)
  );
  const totalWaterSavedM3 = plans.reduce((sum, plan) => sum + (plan.waterSavedM3 || 0), 0);

  const avgSavingsPercent = lots.length
    ? Math.round(
        lots.reduce((sum, lot) => {
          const diff = ((lot.marketAvgPrice - lot.pricePerKg) / lot.marketAvgPrice) * 100;
          return sum + Math.max(0, diff);
        }, 0) / lots.length
      )
    : 0;

  // Farmer-specific warehouse & sales metrics
  const myLots = authUser
    ? lots.filter((l) => l.ownerUid === authUser.uid || (l.ownerEmail && l.ownerEmail === authUser.email))
    : [];
  const myLotIds = new Set(myLots.map((l) => String(l._id)));
  const myIncomingOrders = authUser
    ? orders.filter(
        (o) => o.sellerUid === authUser.uid || myLotIds.has(String(o.lotId))
      )
    : [];

  const myRemainingTons = Number(
    myLots.reduce((sum, lot) => sum + (lot.quantityTons || 0), 0).toFixed(1)
  );
  const mySoldTons = Number(
    myIncomingOrders.reduce((sum, ord) => sum + (ord.tons || 0), 0).toFixed(1)
  );
  const mySalesRevenueUzs = myIncomingOrders.reduce((sum, ord) => sum + (ord.grossAmount || 0), 0);

  const totalSoldTonsAll = Number(
    orders.reduce((sum, ord) => sum + (ord.tons || 0), 0).toFixed(1)
  );

  const stats = {
    isAdmin,
    activeLots: lots.length,
    totalTonsAvailable,
    totalSoldTonsAll,
    totalWaterSavedM3,
    avgSavingsPercent,
    farmerStats: {
      myLotsCount: myLots.length,
      myRemainingTons,
      mySoldTons,
      mySalesRevenueUzs,
      myOrdersCount: myIncomingOrders.length,
    },
  };

  if (isAdmin) {
    stats.totalOrders = orders.length;
    stats.totalGmvUzs = orders.reduce((sum, order) => sum + (order.grossAmount || 0), 0);
    stats.totalPlatformRevenueUzs = orders.reduce(
      (sum, order) => sum + (order.platformFee || 0),
      0
    );
    stats.proSubscribers = proSubscribers;
  }

  res.json({
    stats,
    myLots,
    myIncomingOrders: myIncomingOrders.map((o) => sanitizeOrderForUser(o, isAdmin)),
  });
});

app.get("/api/lots", requireDb, async (req, res) => {
  const { crop, region, q } = req.query;
  const filter = {};
  if (crop && crop !== "Barchasi") filter.crop = crop;
  if (region && region !== "Barchasi") filter.region = region;
  if (q && String(q).trim()) {
    const regex = new RegExp(String(q).trim(), "i");
    filter.$or = [{ title: regex }, { farmerName: regex }, { crop: regex }, { region: regex }];
  }

  const lots = await Lot.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ lots });
});

app.post("/api/lots", requireDb, requireAuth, async (req, res) => {
  const {
    title,
    crop,
    farmerName,
    region,
    address,
    lat,
    lng,
    imageUrl,
    quantityTons,
    pricePerKg,
    marketAvgPrice,
    grade,
    phone,
    organic,
  } = req.body;

  if (!title || !crop || !farmerName || !region || !quantityTons || !pricePerKg) {
    return res.status(400).json({ error: "Barcha majburiy maydonlarni to'ldiring" });
  }

  const price = Number(pricePerKg);
  const avgMarket = Number(marketAvgPrice) || Math.round(price * 1.28);
  const geo = REGION_COORDS[String(region).trim()] || REGION_COORDS.Toshkent;
  const tons = Number(quantityTons);

  const lot = await Lot.create({
    title: String(title).trim(),
    crop: String(crop).trim(),
    farmerName: String(farmerName).trim(),
    ownerUid: req.authUser.uid,
    ownerEmail: req.authUser.email,
    region: String(region).trim(),
    address: String(address || geo.address).trim(),
    lat: Number.isFinite(Number(lat)) && lat !== "" ? Number(lat) : geo.lat,
    lng: Number.isFinite(Number(lng)) && lng !== "" ? Number(lng) : geo.lng,
    imageUrl: String(imageUrl || CROP_IMAGES[crop] || CROP_IMAGES.Pomidor).trim(),
    quantityTons: tons,
    initialTons: tons,
    soldTons: 0,
    pricePerKg: price,
    marketAvgPrice: Math.max(avgMarket, price),
    grade: grade || "1-nav",
    phone: phone || "+998 90 123 45 67",
    organic: Boolean(organic),
  });

  res.status(201).json({ lot });
});

app.delete("/api/lots/:id", requireDb, requireAuth, async (req, res) => {
  const lot = await Lot.findById(req.params.id);
  if (!lot) return res.status(404).json({ error: "Lot topilmadi" });

  const canDelete = req.authUser.isAdmin || lot.ownerUid === req.authUser.uid;
  if (!canDelete) {
    return res.status(403).json({ error: "Faqat o'zingiz joylagan lotni o'chira olasiz" });
  }

  await lot.deleteOne();
  res.json({ ok: true });
});

app.get("/api/orders", requireDb, async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    return res.json({ orders: [] });
  }

  if (authUser.isAdmin) {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({ orders });
  }

  const myLots = await Lot.find({ ownerUid: authUser.uid }).select("_id").lean();
  const myLotIds = myLots.map((l) => l._id);

  const orders = await Order.find({
    $or: [
      { sellerUid: authUser.uid },
      { buyerUid: authUser.uid },
      ...(myLotIds.length ? [{ lotId: { $in: myLotIds } }] : []),
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    orders: orders.map((o) => sanitizeOrderForUser(o, false)),
  });
});

app.post("/api/orders", requireDb, requireAuth, async (req, res) => {
  const { lotId, buyerName, buyerPhone, company, deliveryRegion, deliveryAddress, tons } = req.body;
  const requestedTons = Number(tons);

  if (
    !lotId ||
    !buyerName ||
    !buyerPhone ||
    !deliveryAddress ||
    !String(deliveryAddress).trim() ||
    !requestedTons ||
    requestedTons <= 0
  ) {
    return res
      .status(400)
      .json({ error: "Xaridor ma'lumotlari, yetkazish manzili va hajmni to'g'ri kiriting" });
  }

  const lot = await Lot.findById(lotId);
  if (!lot) {
    return res.status(404).json({ error: "Mahsulot loti topilmadi" });
  }

  if (requestedTons > lot.quantityTons) {
    return res.status(400).json({
      error: `Omborda faqat ${lot.quantityTons} tonna mavjud`,
    });
  }

  const grossAmount = Math.round(requestedTons * 1000 * lot.pricePerKg);
  const platformFee = Math.round(grossAmount * 0.03);

  lot.quantityTons = Number((lot.quantityTons - requestedTons).toFixed(2));
  lot.soldTons = Number(((lot.soldTons || 0) + requestedTons).toFixed(2));
  lot.ordersCount = (lot.ordersCount || 0) + 1;
  await lot.save();

  const order = await Order.create({
    lotId: lot._id,
    lotTitle: lot.title,
    crop: lot.crop,
    region: lot.region,
    sellerUid: lot.ownerUid || "",
    sellerEmail: lot.ownerEmail || "",
    buyerUid: req.authUser.uid,
    buyerName: String(buyerName).trim(),
    company: String(company || "To'g'ridan-to'g'ri xaridor").trim(),
    buyerPhone: String(buyerPhone).trim(),
    deliveryRegion: String(deliveryRegion || lot.region).trim(),
    deliveryAddress: String(deliveryAddress).trim(),
    tons: requestedTons,
    pricePerKg: lot.pricePerKg,
    grossAmount,
    platformFee,
    status: "Yangi",
  });

  res.status(201).json({
    order: sanitizeOrderForUser(order.toObject(), req.authUser.isAdmin),
    lot,
  });
});

app.patch("/api/orders/:id", requireDb, requireAuth, async (req, res) => {
  const { status } = req.body;
  if (!["Yangi", "Tasdiqlangan", "Yetkazilmoqda"].includes(status)) {
    return res.status(400).json({ error: "Noto'g'ri buyurtma holati" });
  }

  const existing = await Order.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Buyurtma topilmadi" });

  const lot = await Lot.findById(existing.lotId).select("ownerUid").lean();
  const canUpdate =
    req.authUser.isAdmin ||
    existing.sellerUid === req.authUser.uid ||
    lot?.ownerUid === req.authUser.uid;

  if (!canUpdate) {
    return res.status(403).json({ error: "Faqat o'z buyurtmangiz holatini o'zgartira olasiz" });
  }

  existing.status = status;
  await existing.save();
  res.json({ order: sanitizeOrderForUser(existing.toObject(), req.authUser.isAdmin) });
});

app.get("/api/plans", requireDb, async (_req, res) => {
  const plans = await FieldPlan.find().sort({ createdAt: -1 }).lean();
  res.json({ plans });
});

app.post("/api/plans", requireDb, async (req, res) => {
  const { fieldName, region, crop, areaHa, irrigationType, customCostUzs, sellingPricePerKgUzs } =
    req.body;
  if (!fieldName || !region || !crop || !areaHa || Number(areaHa) <= 0) {
    return res.status(400).json({ error: "Dala nomi, hudud, ekin va gektarni kiriting" });
  }

  const metrics = calculateFieldMetrics({
    fieldName,
    region,
    crop,
    areaHa,
    irrigationType: irrigationType || "tomchilatib",
    customCostUzs,
    sellingPricePerKgUzs,
  });

  const plan = await FieldPlan.create(metrics);
  res.status(201).json({ plan });
});

app.delete("/api/plans/:id", requireDb, async (req, res) => {
  const deleted = await FieldPlan.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Hisob-kitob topilmadi" });
  res.json({ ok: true });
});

const clientDist = path.join(__dirname, "../client/dist");
if (!process.env.VERCEL && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

if (!process.env.VERCEL) {
  connectMongo()
    .then(async (connected) => {
      if (connected) {
        console.log("MongoDB connected");
        await ensureSeedData();
      }
    })
    .catch((err) => {
      console.error("MongoDB initial connection failed:", err.message);
    })
    .finally(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
      });
    });
}

export default app;
