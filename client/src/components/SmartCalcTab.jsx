import { useState } from "react";
import { Droplets, Sparkles, Save, Sprout, TrendingUp, ArrowRight, RotateCcw } from "lucide-react";
import {
  CROP_PROFILES,
  CURRENCIES,
  FORM_CROPS,
  FORM_REGIONS,
  IRRIGATION_OPTIONS,
  formatCompactMoney,
  formatMoney,
  fromUzs,
  previewFieldCalculation,
  toUzs,
} from "../lib/format";

export default function SmartCalcTab({
  plansCount,
  onSavePlan,
  onOpenPlansPage,
  lang,
  currency,
  onCurrencyChange,
  t,
}) {
  const [fieldName, setFieldName] = useState(t.calc.defaultFieldName);
  const [region, setRegion] = useState("Farg'ona");
  const [crop, setCrop] = useState("Pomidor");
  const [areaHa, setAreaHa] = useState(5);
  const [irrigationType, setIrrigationType] = useState("tomchilatib");
  const [customCostUzs, setCustomCostUzs] = useState("");
  const [sellingPricePerKgUzs, setSellingPricePerKgUzs] = useState(
    CROP_PROFILES.Pomidor.avgPricePerKgUzs
  );
  const [saving, setSaving] = useState(false);

  const preview = previewFieldCalculation({
    crop,
    areaHa,
    irrigationType,
    customCostUzs: customCostUzs === "" ? undefined : customCostUzs,
    sellingPricePerKgUzs,
  });

  const tipText = t.cropTips[crop] || preview.recommendation;

  function handleCropSelect(nextCrop) {
    setCrop(nextCrop);
    setSellingPricePerKgUzs((CROP_PROFILES[nextCrop] || CROP_PROFILES.Pomidor).avgPricePerKgUzs);
  }

  const displayCostValue =
    customCostUzs === ""
      ? ""
      : Number(fromUzs(customCostUzs, currency).toFixed(currency === "USD" ? 2 : 0));

  const displaySellPrice = Number(
    fromUzs(sellingPricePerKgUzs, currency).toFixed(currency === "USD" ? 2 : 0)
  );
  const minSliderUzs = Math.max(500, Math.round(preview.defaultPricePerKgUzs * 0.4));
  const maxSliderUzs = Math.round(preview.defaultPricePerKgUzs * 2);

  const scenarios = [
    {
      label: t.calc.scenarioLow,
      priceUzs: Math.round(sellingPricePerKgUzs * 0.8),
      active: false,
    },
    {
      label: t.calc.scenarioSelected,
      priceUzs: sellingPricePerKgUzs,
      active: true,
    },
    {
      label: t.calc.scenarioHigh,
      priceUzs: Math.round(sellingPricePerKgUzs * 1.25),
      active: false,
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fieldName.trim() || Number(areaHa) <= 0) return;
    setSaving(true);
    try {
      await onSavePlan({
        fieldName,
        region,
        crop,
        areaHa: Number(areaHa),
        irrigationType,
        customCostUzs: customCostUzs === "" ? undefined : Number(customCostUzs),
        sellingPricePerKgUzs: Number(sellingPricePerKgUzs),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:col-span-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.calc.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.calc.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
              {Object.keys(CURRENCIES).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onCurrencyChange(code)}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition ${
                    currency === code
                      ? "bg-white text-amber-700 shadow-2xs dark:bg-slate-900 dark:text-amber-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {CURRENCIES[code].symbol}
                </button>
              ))}
            </div>

            {plansCount > 0 && (
              <button
                type="button"
                onClick={onOpenPlansPage}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <span>{t.calc.viewPlansBtn(plansCount).replace(/\s*→$/, "")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.calc.fieldName}
            </label>
            <input
              type="text"
              required
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.calc.region}
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {FORM_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t.calc.cropType}
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {FORM_CROPS.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleCropSelect(item)}
                className={`rounded-xl border px-2.5 py-2 text-xs font-semibold transition ${
                  crop === item
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {t.crops[item] || item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.calc.areaSize}
            </label>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {areaHa} {t.haUnit}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.5"
            value={areaHa}
            onChange={(e) => setAreaHa(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-700 dark:bg-slate-800/50 sm:grid-cols-2">
          <div>
            <div className="mb-1 flex items-center justify-between gap-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.calc.customCostLabel} ({CURRENCIES[currency].symbol})
              </label>
              {customCostUzs !== "" && (
                <button
                  type="button"
                  onClick={() => setCustomCostUzs("")}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>{t.calc.resetAutoBtn}</span>
                </button>
              )}
            </div>
            <input
              type="number"
              min="0"
              step={currency === "USD" ? "10" : currency === "RUB" ? "500" : "100000"}
              placeholder={String(
                Number(fromUzs(preview.autoCostUzs, currency).toFixed(currency === "USD" ? 0 : 0))
              )}
              value={displayCostValue}
              onChange={(e) => {
                const raw = e.target.value;
                setCustomCostUzs(raw === "" ? "" : Math.max(0, toUzs(raw, currency)));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {t.calc.customCostAutoHint(formatCompactMoney(preview.autoCostUzs, currency, lang))}
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.calc.sellingPriceLabel} ({CURRENCIES[currency].symbol}/kg)
              </label>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {formatMoney(sellingPricePerKgUzs, currency, lang)}/kg
              </span>
            </div>
            <input
              type="number"
              min="0"
              step={currency === "USD" ? "0.05" : currency === "RUB" ? "1" : "100"}
              value={displaySellPrice}
              onChange={(e) => {
                const raw = Number(e.target.value);
                setSellingPricePerKgUzs(Math.max(100, toUzs(raw, currency)));
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <input
              type="range"
              min={minSliderUzs}
              max={maxSliderUzs}
              step={100}
              value={Math.min(maxSliderUzs, Math.max(minSliderUzs, sellingPricePerKgUzs))}
              onChange={(e) => setSellingPricePerKgUzs(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t.calc.irrigationTitle}
          </label>
          <div className="space-y-2">
            {IRRIGATION_OPTIONS.map((opt) => {
              const tr = t.irrigation[opt.id];
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                    irrigationType === opt.id
                      ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50"
                      : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="irrigation"
                      checked={irrigationType === opt.id}
                      onChange={() => setIrrigationType(opt.id)}
                      className="accent-emerald-600"
                    />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {tr.label}
                    </span>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-800">
                    {tr.badge}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              {t.calc.netProfitLabel}
            </p>
            <p
              className={`text-lg font-extrabold ${
                preview.estimatedProfitUzs >= 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatMoney(preview.estimatedProfitUzs, currency, lang)}
            </p>
          </div>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
              preview.roiPercent >= 0
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            ROI: {preview.roiPercent >= 0 ? `+${preview.roiPercent}%` : `${preview.roiPercent}%`}
          </span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? t.calc.savingBtn : t.calc.saveBtn}</span>
        </button>
      </form>

      <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-4 text-white shadow-lg dark:border dark:border-slate-800 sm:p-6 lg:col-span-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              {t.calc.liveForecast}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                preview.roiPercent >= 0
                  ? "bg-white/10 text-emerald-300"
                  : "bg-rose-500/20 text-rose-300"
              }`}
            >
              ROI: {preview.roiPercent >= 0 ? `+${preview.roiPercent}%` : `${preview.roiPercent}%`}
            </span>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{t.calc.netProfitLabel}</p>
            <p
              className={`mt-1 text-3xl font-extrabold tracking-tight ${
                preview.estimatedProfitUzs >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatMoney(preview.estimatedProfitUzs, currency, lang)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-3 text-xs ring-1 ring-white/10">
              <div>
                <p className="text-slate-400">{t.calc.revenueLabel}</p>
                <p className="mt-0.5 font-bold text-white">
                  {formatCompactMoney(preview.estimatedRevenueUzs, currency, lang)}
                </p>
              </div>
              <div>
                <p className="text-slate-400">{t.calc.estCostCardLabel}</p>
                <p className="mt-0.5 font-bold text-rose-300">
                  − {formatCompactMoney(preview.estimatedCostUzs, currency, lang)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-amber-300">
              {t.calc.breakEvenLabel}:{" "}
              <strong>{formatMoney(preview.breakEvenPricePerKgUzs, currency, lang)} / kg</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-3.5 ring-1 ring-white/10">
              <div className="flex items-center gap-1.5 text-xs text-cyan-300">
                <Droplets className="h-4 w-4" />
                <span>{t.calc.waterSavedLabel}</span>
              </div>
              <p className="mt-1 text-lg font-bold">
                {new Intl.NumberFormat("uz-UZ").format(preview.waterSavedM3)} m³
              </p>
              <p className="text-[11px] text-slate-400">
                {t.calc.waterNeedLabel}: {new Intl.NumberFormat("uz-UZ").format(preview.waterNeededM3)} m³
              </p>
            </div>

            <div className="rounded-xl bg-white/5 p-3.5 ring-1 ring-white/10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                <Sprout className="h-4 w-4" />
                <span>{t.calc.expectedYieldLabel}</span>
              </div>
              <p className="mt-1 text-lg font-bold">
                {preview.estimatedYieldTons} {t.tonFull}
              </p>
              <p className="text-[11px] text-slate-400">
                {t.calc.fertilizerLabel}: {preview.fertilizerKg} kg
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.calc.scenarioTitle}
            </p>
            <div className="space-y-2">
              {scenarios.map((sc) => {
                const scRevenue = Math.round(preview.estimatedYieldTons * 1000 * sc.priceUzs);
                const scProfit = scRevenue - preview.estimatedCostUzs;
                return (
                  <div
                    key={sc.label}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                      sc.active
                        ? "bg-emerald-500/20 ring-1 ring-emerald-400/40"
                        : "bg-white/5"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-200">{sc.label}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatMoney(sc.priceUzs, currency, lang)} / kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          scProfit >= 0 ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {formatCompactMoney(scProfit, currency, lang)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-emerald-500/15 p-4 ring-1 ring-emerald-400/25">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <TrendingUp className="h-4 w-4" />
            <span>{t.calc.agronomistTip}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-200">{tipText}</p>
        </div>
      </div>
    </div>
  );
}
