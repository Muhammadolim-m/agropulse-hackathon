export const REGIONS = [
  "Barchasi",
  "Toshkent",
  "Farg'ona",
  "Andijon",
  "Namangan",
  "Samarqand",
  "Buxoro",
  "Jizzax",
  "Qashqadaryo",
  "Surxondaryo",
  "Xorazm",
];

export const FORM_REGIONS = REGIONS.filter((r) => r !== "Barchasi");

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

export const CURRENCIES = {
  UZS: { code: "UZS", rateFromUzs: 1, symbol: "so'm", label: "UZS" },
  USD: { code: "USD", rateFromUzs: 12800, symbol: "$", label: "USD ($)" },
  RUB: { code: "RUB", rateFromUzs: 132, symbol: "₽", label: "RUB (₽)" },
};

export function fromUzs(uzsAmount, currency = "UZS") {
  const cur = CURRENCIES[currency] || CURRENCIES.UZS;
  return Number(uzsAmount || 0) / cur.rateFromUzs;
}

export function toUzs(amountInCurrency, currency = "UZS") {
  const cur = CURRENCIES[currency] || CURRENCIES.UZS;
  return Math.round(Number(amountInCurrency || 0) * cur.rateFromUzs);
}

export function formatMoney(uzsAmount, currency = "UZS", lang = "uz", decimals = null) {
  const val = fromUzs(uzsAmount, currency);
  if (currency === "USD") {
    const d = decimals ?? (Math.abs(val) < 10 ? 2 : 0);
    return `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(val)}`;
  }
  if (currency === "RUB") {
    const d = decimals ?? (Math.abs(val) < 100 ? 1 : 0);
    return `${new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(val)} ₽`;
  }
  const unit = lang === "en" ? "UZS" : lang === "ru" ? "сум" : "so'm";
  return `${new Intl.NumberFormat("uz-UZ").format(Math.round(val))} ${unit}`;
}

export function formatCompactMoney(uzsAmount, currency = "UZS", lang = "uz") {
  const val = fromUzs(uzsAmount, currency);
  if (currency === "USD") {
    if (Math.abs(val) >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (Math.abs(val) >= 10_000) return `$${(val / 1_000).toFixed(1)}K`;
    return formatMoney(uzsAmount, currency, lang, Math.abs(val) < 10 ? 2 : 0);
  }
  if (currency === "RUB") {
    if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(2)} млн ₽`;
    return `${new Intl.NumberFormat("ru-RU").format(Math.round(val))} ₽`;
  }
  const num = Number(uzsAmount || 0);
  const unit = lang === "en" ? "UZS" : lang === "ru" ? "сум" : "so'm";
  const mlrd = lang === "en" ? "B" : lang === "ru" ? "млрд" : "mlrd";
  const mln = lang === "en" ? "M" : lang === "ru" ? "млн" : "mln";
  if (Math.abs(num) >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} ${mlrd} ${unit}`;
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} ${mln} ${unit}`;
  return `${new Intl.NumberFormat("uz-UZ").format(Math.round(num))} ${unit}`;
}

export function getGoogleMapsSearchUrl(lot) {
  if (lot?.lat != null && lot?.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lot.lat},${lot.lng}`;
  }
  const q = encodeURIComponent(`${lot?.address || ""} ${lot?.region || "Uzbekistan"}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function getGoogleMapsDirectionsUrl(lot) {
  if (lot?.lat != null && lot?.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}`;
  }
  const q = encodeURIComponent(`${lot?.address || ""} ${lot?.region || "Uzbekistan"}`.trim());
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export function getGoogleMapsEmbedUrl(lot) {
  const query =
    lot?.lat != null && lot?.lng != null
      ? `${lot.lat},${lot.lng}`
      : encodeURIComponent(`${lot?.address || ""} ${lot?.region || "Uzbekistan"}`.trim());
  return `https://maps.google.com/maps?q=${query}&z=12&output=embed`;
}

export const CROPS = [
  "Barchasi",
  "Pomidor",
  "Olma",
  "Uzum",
  "Gilos",
  "Qovun",
  "Tarvuz",
  "Kartoshka",
  "Piyoz",
  "Sabzi",
  "Bodring",
  "Anor",
  "Bug'doy",
];
export const FORM_CROPS = CROPS.filter((c) => c !== "Barchasi");

export const IRRIGATION_OPTIONS = [
  {
    id: "tomchilatib",
    label: "Tomchilatib sug'orish",
    badge: "-40% suv • +18% hosil",
    waterFactor: 0.6,
    yieldFactor: 1.18,
    costFactor: 0.92,
  },
  {
    id: "yomgirlatib",
    label: "Yomg'irlatib sug'orish",
    badge: "-22% suv • +10% hosil",
    waterFactor: 0.78,
    yieldFactor: 1.1,
    costFactor: 0.96,
  },
  {
    id: "ariq",
    label: "An'anaviy ariq usuli",
    badge: "Standart sarf",
    waterFactor: 1,
    yieldFactor: 1,
    costFactor: 1,
  },
];

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

export function previewFieldCalculation({
  crop,
  areaHa,
  irrigationType,
  customCostUzs,
  sellingPricePerKgUzs,
}) {
  const profile = CROP_PROFILES[crop] || CROP_PROFILES.Pomidor;
  const option = IRRIGATION_OPTIONS.find((o) => o.id === irrigationType) || IRRIGATION_OPTIONS[0];
  const ha = Math.max(0.1, Number(areaHa) || 1);

  const baselineWater = Math.round(profile.baseWaterM3PerHa * ha);
  const waterNeededM3 = Math.round(baselineWater * option.waterFactor);
  const waterSavedM3 = Math.max(0, baselineWater - waterNeededM3);
  const fertilizerKg = Math.round(profile.fertilizerKgPerHa * ha);
  const estimatedYieldTons = Number((profile.baseYieldTonsPerHa * ha * option.yieldFactor).toFixed(1));

  const autoCostUzs = Math.round(profile.costPerHaUzs * ha * option.costFactor);
  const hasCustomCost =
    customCostUzs !== undefined && customCostUzs !== null && customCostUzs !== "" && Number(customCostUzs) >= 0;
  const estimatedCostUzs = hasCustomCost ? Math.round(Number(customCostUzs)) : autoCostUzs;

  const sellingPricePerKg =
    sellingPricePerKgUzs !== undefined &&
    sellingPricePerKgUzs !== null &&
    Number(sellingPricePerKgUzs) > 0
      ? Math.round(Number(sellingPricePerKgUzs))
      : profile.avgPricePerKgUzs;

  const estimatedRevenueUzs = Math.round(estimatedYieldTons * 1000 * sellingPricePerKg);
  const estimatedProfitUzs = estimatedRevenueUzs - estimatedCostUzs;
  const breakEvenPricePerKgUzs = Math.round(
    estimatedCostUzs / Math.max(estimatedYieldTons * 1000, 1)
  );
  const roiPercent = Math.round((estimatedProfitUzs / Math.max(estimatedCostUzs, 1)) * 100);

  return {
    waterNeededM3,
    waterSavedM3,
    fertilizerKg,
    estimatedYieldTons,
    autoCostUzs,
    estimatedCostUzs,
    isCustomCost: hasCustomCost,
    sellingPricePerKgUzs: sellingPricePerKg,
    defaultPricePerKgUzs: profile.avgPricePerKgUzs,
    breakEvenPricePerKgUzs,
    estimatedRevenueUzs,
    estimatedProfitUzs,
    roiPercent,
    recommendation: profile.tip,
  };
}

export function formatUzs(amount, currency = "so'm") {
  return `${new Intl.NumberFormat("uz-UZ").format(Math.round(amount || 0))} ${currency}`;
}

export function formatCompactUzs(amount, lang = "uz") {
  const num = Number(amount || 0);
  const mlrd = lang === "en" ? "B" : lang === "ru" ? "млрд" : "mlrd";
  const mln = lang === "en" ? "M" : lang === "ru" ? "млн" : "mln";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} ${mlrd}`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} ${mln}`;
  return new Intl.NumberFormat("uz-UZ").format(Math.round(num));
}
