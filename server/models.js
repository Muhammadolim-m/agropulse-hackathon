import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    displayName: { type: String, default: "", trim: true },
    photoURL: { type: String, default: "" },
    provider: { type: String, default: "password" },
    subscriptionPlan: { type: String, enum: ["free", "pro"], default: "free" },
    subscriptionUpdatedAt: { type: Date },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const lotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    farmerName: { type: String, required: true, trim: true },
    ownerUid: { type: String, default: "", index: true },
    ownerEmail: { type: String, default: "", trim: true, lowercase: true },
    region: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    lat: { type: Number, default: 41.2995 },
    lng: { type: Number, default: 69.2401 },
    imageUrl: { type: String, default: "" },
    quantityTons: { type: Number, required: true, min: 0 },
    initialTons: { type: Number, default: 0, min: 0 },
    soldTons: { type: Number, default: 0, min: 0 },
    pricePerKg: { type: Number, required: true, min: 100 },
    marketAvgPrice: { type: Number, required: true, min: 100 },
    grade: { type: String, default: "1-nav" },
    phone: { type: String, default: "+998 90 123 45 67" },
    organic: { type: Boolean, default: false },
    ordersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: "Lot", required: true },
    lotTitle: { type: String, required: true },
    crop: { type: String, required: true },
    region: { type: String, required: true },
    sellerUid: { type: String, default: "", index: true },
    sellerEmail: { type: String, default: "" },
    buyerUid: { type: String, default: "", index: true },
    buyerName: { type: String, required: true, trim: true },
    company: { type: String, default: "To'g'ridan-to'g'ri xaridor", trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    tons: { type: Number, required: true, min: 0.1 },
    pricePerKg: { type: Number, required: true },
    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Yangi", "Tasdiqlangan", "Yetkazilmoqda"],
      default: "Yangi",
    },
  },
  { timestamps: true }
);

const fieldPlanSchema = new mongoose.Schema(
  {
    fieldName: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    areaHa: { type: Number, required: true, min: 0.1 },
    irrigationType: {
      type: String,
      enum: ["tomchilatib", "yomgirlatib", "ariq"],
      default: "tomchilatib",
    },
    waterNeededM3: { type: Number, required: true },
    waterSavedM3: { type: Number, required: true },
    fertilizerKg: { type: Number, required: true },
    estimatedYieldTons: { type: Number, required: true },
    estimatedCostUzs: { type: Number, required: true },
    autoCostUzs: { type: Number, default: 0 },
    isCustomCost: { type: Boolean, default: false },
    sellingPricePerKgUzs: { type: Number, default: 0 },
    breakEvenPricePerKgUzs: { type: Number, default: 0 },
    estimatedRevenueUzs: { type: Number, required: true },
    estimatedProfitUzs: { type: Number, required: true },
    roiPercent: { type: Number, required: true },
    recommendation: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Lot = mongoose.models.Lot || mongoose.model("Lot", lotSchema);
export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export const FieldPlan =
  mongoose.models.FieldPlan || mongoose.model("FieldPlan", fieldPlanSchema);
