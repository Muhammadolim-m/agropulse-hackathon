import { Lot, Order, FieldPlan } from "./models.js";

export const CROP_IMAGES = {
  Olma: "/crops/olma.jpg",
  Pomidor: "/crops/pomidor.jpg",
  Uzum: "/crops/uzum.jpg",
  Kartoshka: "/crops/kartoshka.jpg",
  Piyoz: "/crops/piyoz.jpg",
  "Bug'doy": "/crops/bugdoy.jpg",
  Gilos: "/crops/gilos.jpg",
  Qovun: "/crops/qovun.jpg",
  Tarvuz: "/crops/tarvuz.jpg",
  Sabzi: "/crops/sabzi.jpg",
  Bodring: "/crops/bodring.jpg",
  Anor: "/crops/anor.jpg",
};

export const REGION_COORDS = {
  Toshkent: { lat: 41.2213, lng: 69.2165, address: "Zangiota tumani, Toshkent viloyati" },
  "Farg'ona": { lat: 40.4892, lng: 72.0365, address: "Quva tumani, Farg'ona viloyati" },
  Andijon: { lat: 40.7821, lng: 72.3442, address: "Asaka tumani, Andijon viloyati" },
  Namangan: { lat: 41.0011, lng: 71.6683, address: "Chust tumani, Namangan viloyati" },
  Samarqand: { lat: 39.4239, lng: 67.2517, address: "Urgut tumani, Samarqand viloyati" },
  Buxoro: { lat: 39.7747, lng: 64.4286, address: "G'ijduvon tumani, Buxoro viloyati" },
  Jizzax: { lat: 39.7196, lng: 67.6246, address: "Baxmal tumani, Jizzax viloyati" },
  Qashqadaryo: { lat: 38.8606, lng: 65.7891, address: "Qarshi tumani, Qashqadaryo viloyati" },
  Surxondaryo: { lat: 37.9409, lng: 67.5709, address: "Denov tumani, Surxondaryo viloyati" },
  Xorazm: { lat: 41.5534, lng: 60.6317, address: "Urganch tumani, Xorazm viloyati" },
};

export const CROP_PROFILES = {
  Pomidor: {
    baseWaterM3PerHa: 5200,
    fertilizerKgPerHa: 320,
    baseYieldTonsPerHa: 42,
    costPerHaUzs: 28000000,
    avgPricePerKgUzs: 4800,
    tip: "Tomchilatib sug'orish ildiz chirishini kamaytiradi va hosildorlikni +18% oshiradi.",
  },
  Olma: {
    baseWaterM3PerHa: 6000,
    fertilizerKgPerHa: 260,
    baseYieldTonsPerHa: 28,
    costPerHaUzs: 24000000,
    avgPricePerKgUzs: 7500,
    tip: "Shudring va zararkunandaga qarshi erta bahorda profilaktik ishlov tavsiya etiladi.",
  },
  Kartoshka: {
    baseWaterM3PerHa: 4500,
    fertilizerKgPerHa: 350,
    baseYieldTonsPerHa: 30,
    costPerHaUzs: 22000000,
    avgPricePerKgUzs: 4200,
    tip: "Kaliy o'g'itini tuganak tugish davrida berish saqlanish muddatini uzaytiradi.",
  },
  Piyoz: {
    baseWaterM3PerHa: 4800,
    fertilizerKgPerHa: 290,
    baseYieldTonsPerHa: 45,
    costPerHaUzs: 19000000,
    avgPricePerKgUzs: 2600,
    tip: "Hosil yig'imidan 15 kun oldin sug'orishni to'xtatish sifatni keskin yaxshilaydi.",
  },
  Uzum: {
    baseWaterM3PerHa: 4200,
    fertilizerKgPerHa: 220,
    baseYieldTonsPerHa: 22,
    costPerHaUzs: 25000000,
    avgPricePerKgUzs: 9500,
    tip: "Eksportbop navlarda tomchilatib sug'orish shakar miqdorini barqaror ushlaydi.",
  },
  "Bug'doy": {
    baseWaterM3PerHa: 3800,
    fertilizerKgPerHa: 240,
    baseYieldTonsPerHa: 6.5,
    costPerHaUzs: 9500000,
    avgPricePerKgUzs: 3400,
    tip: "Azotli oziqlantirishni 2 bosqichda berish don oqsilini oshiradi.",
  },
  Gilos: {
    baseWaterM3PerHa: 5400,
    fertilizerKgPerHa: 230,
    baseYieldTonsPerHa: 16,
    costPerHaUzs: 30000000,
    avgPricePerKgUzs: 18500,
    tip: "Gilos mevasini yorilishidan saqlash uchun pishish davrida bir maromda tomchilatib sug'oring.",
  },
  Qovun: {
    baseWaterM3PerHa: 3600,
    fertilizerKgPerHa: 210,
    baseYieldTonsPerHa: 26,
    costPerHaUzs: 15000000,
    avgPricePerKgUzs: 4500,
    tip: "Meva pishishiga 10 kun qolganda suvni kamaytirish qovun shirinligini oshiradi.",
  },
  Tarvuz: {
    baseWaterM3PerHa: 3900,
    fertilizerKgPerHa: 230,
    baseYieldTonsPerHa: 38,
    costPerHaUzs: 14000000,
    avgPricePerKgUzs: 2400,
    tip: "Poliz ekinlarida tomchilatib sug'orish 40% suv tejaydi va palak kasalliklarini kamaytiradi.",
  },
  Sabzi: {
    baseWaterM3PerHa: 4300,
    fertilizerKgPerHa: 270,
    baseYieldTonsPerHa: 36,
    costPerHaUzs: 17000000,
    avgPricePerKgUzs: 3100,
    tip: "Yumshoq tuproqda bir tekis namlik sabzi ildizining tekis va silliq o'sishini ta'minlaydi.",
  },
  Bodring: {
    baseWaterM3PerHa: 5000,
    fertilizerKgPerHa: 300,
    baseYieldTonsPerHa: 48,
    costPerHaUzs: 26000000,
    avgPricePerKgUzs: 5400,
    tip: "Issiqxona va ochiq dalada tez-tez, lekin me'yorli tomchilatib sug'orish hosilni oshiradi.",
  },
  Anor: {
    baseWaterM3PerHa: 4400,
    fertilizerKgPerHa: 200,
    baseYieldTonsPerHa: 20,
    costPerHaUzs: 21000000,
    avgPricePerKgUzs: 11500,
    tip: "Anor bog'larida fosfor-kaliyli oziqlantirish meva rangi va eksport sifatini kuchaytiradi.",
  },
};

export function calculateFieldMetrics({
  fieldName,
  region,
  crop,
  areaHa,
  irrigationType,
  customCostUzs,
  sellingPricePerKgUzs,
}) {
  const profile = CROP_PROFILES[crop] || CROP_PROFILES.Pomidor;
  const ha = Number(areaHa);

  const waterFactor =
    irrigationType === "tomchilatib" ? 0.6 : irrigationType === "yomgirlatib" ? 0.78 : 1;
  const yieldFactor =
    irrigationType === "tomchilatib" ? 1.18 : irrigationType === "yomgirlatib" ? 1.1 : 1;
  const costFactor =
    irrigationType === "tomchilatib" ? 0.92 : irrigationType === "yomgirlatib" ? 0.96 : 1;

  const baselineWater = Math.round(profile.baseWaterM3PerHa * ha);
  const waterNeededM3 = Math.round(baselineWater * waterFactor);
  const waterSavedM3 = Math.max(0, baselineWater - waterNeededM3);
  const fertilizerKg = Math.round(profile.fertilizerKgPerHa * ha);
  const estimatedYieldTons = Number((profile.baseYieldTonsPerHa * ha * yieldFactor).toFixed(1));

  const autoCostUzs = Math.round(profile.costPerHaUzs * ha * costFactor);
  const hasCustomCost =
    customCostUzs !== undefined && customCostUzs !== null && customCostUzs !== "" && Number(customCostUzs) >= 0;
  const estimatedCostUzs = hasCustomCost ? Math.round(Number(customCostUzs)) : autoCostUzs;

  const sellingPrice =
    sellingPricePerKgUzs !== undefined &&
    sellingPricePerKgUzs !== null &&
    Number(sellingPricePerKgUzs) > 0
      ? Math.round(Number(sellingPricePerKgUzs))
      : profile.avgPricePerKgUzs;

  const estimatedRevenueUzs = Math.round(estimatedYieldTons * 1000 * sellingPrice);
  const estimatedProfitUzs = estimatedRevenueUzs - estimatedCostUzs;
  const breakEvenPricePerKgUzs = Math.round(
    estimatedCostUzs / Math.max(estimatedYieldTons * 1000, 1)
  );
  const roiPercent = Math.round((estimatedProfitUzs / Math.max(estimatedCostUzs, 1)) * 100);

  return {
    fieldName: fieldName.trim(),
    region: region.trim(),
    crop,
    areaHa: ha,
    irrigationType,
    waterNeededM3,
    waterSavedM3,
    fertilizerKg,
    estimatedYieldTons,
    estimatedCostUzs,
    autoCostUzs,
    isCustomCost: hasCustomCost,
    sellingPricePerKgUzs: sellingPrice,
    breakEvenPricePerKgUzs,
    estimatedRevenueUzs,
    estimatedProfitUzs,
    roiPercent,
    recommendation: profile.tip,
  };
}

const CATALOG_SEED_LOTS = [
  {
    title: "Semerenko Qizil Olma — Eksportbop",
    crop: "Olma",
    farmerName: "Farg'ona Bog'lari Fermer Xo'jaligi",
    region: "Farg'ona",
    address: "Quva tumani, Bog'iston mahallasi",
    lat: 40.4892,
    lng: 72.0365,
    imageUrl: CROP_IMAGES.Olma,
    quantityTons: 24,
    pricePerKg: 7200,
    marketAvgPrice: 9500,
    grade: "Premium",
    phone: "+998 90 555 12 34",
    organic: true,
    ordersCount: 2,
  },
  {
    title: "Issiqxona Pushti Pomidor",
    crop: "Pomidor",
    farmerName: "Zangiota Agro Tomchi",
    region: "Toshkent",
    address: "Zangiota tumani, Quyoshli QFY",
    lat: 41.2213,
    lng: 69.2165,
    imageUrl: CROP_IMAGES.Pomidor,
    quantityTons: 14,
    pricePerKg: 4600,
    marketAvgPrice: 6200,
    grade: "1-nav",
    phone: "+998 93 412 88 90",
    organic: true,
    ordersCount: 1,
  },
  {
    title: "Samarqand Qora Kishmish Uzumi",
    crop: "Uzum",
    farmerName: "Urgut Tokzorlari",
    region: "Samarqand",
    address: "Urgut tumani, Qoratepa massivi",
    lat: 39.4239,
    lng: 67.2517,
    imageUrl: CROP_IMAGES.Uzum,
    quantityTons: 18,
    pricePerKg: 9200,
    marketAvgPrice: 12500,
    grade: "Eksporter",
    phone: "+998 91 310 44 19",
    organic: true,
    ordersCount: 1,
  },
  {
    title: "Sifatli Gala Kartoshkasi",
    crop: "Kartoshka",
    farmerName: "Baxmal Dehqon Klasteri",
    region: "Jizzax",
    address: "Baxmal tumani, O'smat hududi",
    lat: 39.7196,
    lng: 67.6246,
    imageUrl: CROP_IMAGES.Kartoshka,
    quantityTons: 40,
    pricePerKg: 3800,
    marketAvgPrice: 5100,
    grade: "1-nav",
    phone: "+998 94 701 23 11",
    organic: false,
    ordersCount: 0,
  },
  {
    title: "Quritilgan Sariq Piyoz (Ulgurji)",
    crop: "Piyoz",
    farmerName: "Oltin Dalalar MCHJ",
    region: "Andijon",
    address: "Asaka tumani, Yangiobod dalasi",
    lat: 40.7821,
    lng: 72.3442,
    imageUrl: CROP_IMAGES.Piyoz,
    quantityTons: 55,
    pricePerKg: 2300,
    marketAvgPrice: 3200,
    grade: "1-nav",
    phone: "+998 99 820 19 05",
    organic: false,
    ordersCount: 0,
  },
  {
    title: "Yuqori Kleykovinali Bug'doy",
    crop: "Bug'doy",
    farmerName: "Qarshi Don-Agro",
    region: "Qashqadaryo",
    address: "Qarshi tumani, Beshkent yo'li",
    lat: 38.8606,
    lng: 65.7891,
    imageUrl: CROP_IMAGES["Bug'doy"],
    quantityTons: 80,
    pricePerKg: 3100,
    marketAvgPrice: 3900,
    grade: "Premium",
    phone: "+998 97 224 77 60",
    organic: false,
    ordersCount: 0,
  },
  {
    title: "Namangan Yirik Eksport Gilosi",
    crop: "Gilos",
    farmerName: "Chust Mevazor Bog'i",
    region: "Namangan",
    address: "Chust tumani, Olmos qishlog'i",
    lat: 41.0011,
    lng: 71.6683,
    imageUrl: CROP_IMAGES.Gilos,
    quantityTons: 12,
    pricePerKg: 17500,
    marketAvgPrice: 23000,
    grade: "Eksporter",
    phone: "+998 90 644 18 22",
    organic: true,
    ordersCount: 0,
  },
  {
    title: "Mirzacho'l Asal Qovuni (Saralangan)",
    crop: "Qovun",
    farmerName: "Sirdaryo Poliz Klasteri",
    region: "Jizzax",
    address: "Paxtakor tumani, Dalazor",
    lat: 40.3152,
    lng: 67.9541,
    imageUrl: CROP_IMAGES.Qovun,
    quantityTons: 32,
    pricePerKg: 4200,
    marketAvgPrice: 5800,
    grade: "Premium",
    phone: "+998 93 520 77 14",
    organic: true,
    ordersCount: 0,
  },
  {
    title: "Shirin Poliz Tarvuzi (Ulgurji)",
    crop: "Tarvuz",
    farmerName: "Buxoro Polizlari",
    region: "Buxoro",
    address: "G'ijduvon tumani, Zarangari",
    lat: 39.7747,
    lng: 64.4286,
    imageUrl: CROP_IMAGES.Tarvuz,
    quantityTons: 48,
    pricePerKg: 2100,
    marketAvgPrice: 3000,
    grade: "1-nav",
    phone: "+998 91 402 91 30",
    organic: false,
    ordersCount: 0,
  },
  {
    title: "Yuvilgan Sariq & Qizil Sabzi",
    crop: "Sabzi",
    farmerName: "Xorazm Tomorqa Agro",
    region: "Xorazm",
    address: "Urganch tumani, G'oybu hududi",
    lat: 41.5534,
    lng: 60.6317,
    imageUrl: CROP_IMAGES.Sabzi,
    quantityTons: 35,
    pricePerKg: 2900,
    marketAvgPrice: 3900,
    grade: "1-nav",
    phone: "+998 99 515 63 80",
    organic: false,
    ordersCount: 0,
  },
  {
    title: "Karsildoq Issiqxona Bodringi",
    crop: "Bodring",
    farmerName: "Qibray GreenHouse",
    region: "Toshkent",
    address: "Qibray tumani, Chinobod",
    lat: 41.3897,
    lng: 69.4658,
    imageUrl: CROP_IMAGES.Bodring,
    quantityTons: 16,
    pricePerKg: 5100,
    marketAvgPrice: 6900,
    grade: "Premium",
    phone: "+998 94 218 44 09",
    organic: true,
    ordersCount: 0,
  },
  {
    title: "Dashnobod Qizil Anori — Eksport",
    crop: "Anor",
    farmerName: "Surxon Bog'dorchilik",
    region: "Surxondaryo",
    address: "Denov tumani, Dashnobod massivi",
    lat: 38.2675,
    lng: 67.8981,
    imageUrl: CROP_IMAGES.Anor,
    quantityTons: 20,
    pricePerKg: 10800,
    marketAvgPrice: 14500,
    grade: "Eksporter",
    phone: "+998 97 801 33 55",
    organic: true,
    ordersCount: 0,
  },
];

let seeded = false;

export async function ensureSeedData() {
  if (seeded) return;

  const existingLots = await Lot.find().lean();
  const existingTitles = new Set(existingLots.map((l) => l.title));

  // Backfill imageUrl and Google Maps coordinates on existing lots if needed
  for (const item of existingLots) {
    const geo = REGION_COORDS[item.region] || REGION_COORDS.Toshkent;
    const needsUpdate =
      !item.imageUrl ||
      item.imageUrl.endsWith(".png") ||
      !item.address ||
      (item.lat === 41.2995 && item.lng === 69.2401);
    if (needsUpdate) {
      await Lot.findByIdAndUpdate(item._id, {
        $set: {
          imageUrl:
            !item.imageUrl || item.imageUrl.endsWith(".png")
              ? CROP_IMAGES[item.crop] || CROP_IMAGES.Pomidor
              : item.imageUrl,
          address: item.address || geo.address,
          lat: item.lat == null || (item.lat === 41.2995 && item.lng === 69.2401) ? geo.lat : item.lat,
          lng: item.lng == null || (item.lat === 41.2995 && item.lng === 69.2401) ? geo.lng : item.lng,
        },
      });
    }
  }

  const missingLots = CATALOG_SEED_LOTS.filter((s) => !existingTitles.has(s.title));
  let insertedLots = [];
  if (missingLots.length > 0) {
    insertedLots = await Lot.insertMany(missingLots);
  }

  const ordersCount = await Order.countDocuments();
  if (ordersCount === 0) {
    const allLots = existingLots.length ? existingLots : insertedLots;
    const firstLot = allLots[0];
    const secondLot = allLots[1];
    if (firstLot && secondLot) {
      await Order.insertMany([
        {
          lotId: firstLot._id,
          lotTitle: firstLot.title,
          crop: firstLot.crop,
          region: firstLot.region,
          buyerName: "Azizbek Karimov",
          company: "Baraka Supermarket Tarmog'i",
          buyerPhone: "+998 90 998 11 22",
          tons: 5,
          pricePerKg: firstLot.pricePerKg,
          grossAmount: 5 * 1000 * firstLot.pricePerKg,
          platformFee: Math.round(5 * 1000 * firstLot.pricePerKg * 0.03),
          status: "Tasdiqlangan",
        },
        {
          lotId: secondLot._id,
          lotTitle: secondLot.title,
          crop: secondLot.crop,
          region: secondLot.region,
          buyerName: "Dilshod Tursunov",
          company: "Toshkent Fresh Export",
          buyerPhone: "+998 93 777 45 00",
          tons: 3,
          pricePerKg: secondLot.pricePerKg,
          grossAmount: 3 * 1000 * secondLot.pricePerKg,
          platformFee: Math.round(3 * 1000 * secondLot.pricePerKg * 0.03),
          status: "Yetkazilmoqda",
        },
      ]);
    }
  }

  const plansCount = await FieldPlan.countDocuments();
  if (plansCount === 0) {
    await FieldPlan.insertMany([
      calculateFieldMetrics({
        fieldName: "Shimoliy Uchastka #1",
        region: "Farg'ona",
        crop: "Pomidor",
        areaHa: 4.5,
        irrigationType: "tomchilatib",
      }),
      calculateFieldMetrics({
        fieldName: "Bog'bon Dala #2",
        region: "Samarqand",
        crop: "Uzum",
        areaHa: 6,
        irrigationType: "tomchilatib",
      }),
      calculateFieldMetrics({
        fieldName: "Chust Bog'i #3",
        region: "Namangan",
        crop: "Gilos",
        areaHa: 3.5,
        irrigationType: "tomchilatib",
      }),
    ]);
  }

  seeded = true;
}
