import { MapPin, Sprout, Droplets, Trash2, Plus, Ruler, Wallet } from "lucide-react";
import { CROP_IMAGES, formatCompactMoney, formatMoney } from "../lib/format";

export default function FieldPlansTab({ plans, onDeletePlan, onGoToCalc, lang, currency, t }) {
  const totalAreaHa = Number(plans.reduce((s, p) => s + (p.areaHa || 0), 0).toFixed(1));
  const totalYieldTons = Number(
    plans.reduce((s, p) => s + (p.estimatedYieldTons || 0), 0).toFixed(1)
  );
  const totalWaterSaved = plans.reduce((s, p) => s + (p.waterSavedM3 || 0), 0);
  const totalNetProfitUzs = plans.reduce((s, p) => s + (p.estimatedProfitUzs || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.plansPage.title} ({plans.length})
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t.plansPage.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onGoToCalc}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          <span>{t.plansPage.newCalcBtn.replace(/^\+\s*/, "")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.plansPage.totalAreaLabel}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAreaHa} {t.haUnit}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Ruler className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-slate-900">
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t.plansPage.totalYieldLabel}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalYieldTons} {t.tonFull}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Sprout className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-5 dark:border-cyan-900/60 dark:from-cyan-950/40 dark:to-slate-900">
          <div>
            <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              {t.plansPage.totalWaterSavedLabel}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
              {new Intl.NumberFormat("uz-UZ").format(totalWaterSaved)} m³
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
            <Droplets className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/60 dark:from-amber-950/40 dark:to-slate-900">
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              {t.plansPage.totalNetProfitLabel}
            </p>
            <p
              className={`mt-1 text-2xl font-extrabold ${
                totalNetProfitUzs >= 0
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCompactMoney(totalNetProfitUzs, currency, lang)}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            {t.plansPage.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.plansPage.emptySub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const imgSrc = CROP_IMAGES[plan.crop] || CROP_IMAGES.Pomidor;
            const irrLabel = t.irrigation[plan.irrigationType]?.label || plan.irrigationType;

            return (
              <article
                key={plan._id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={imgSrc} alt={plan.crop} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-slate-950/65 to-transparent p-3">
                      <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                        {t.crops[plan.crop] || plan.crop}
                      </span>
                      <button
                        onClick={() => onDeletePlan(plan._id)}
                        title={t.market.deleteLot}
                        className="rounded-lg bg-white/90 p-1.5 text-slate-600 transition hover:bg-rose-600 hover:text-white dark:bg-slate-900/90 dark:text-slate-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {plan.fieldName}
                      </h3>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{plan.region}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                      <div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {t.plansPage.colArea}
                        </p>
                        <p className="text-base font-extrabold text-slate-900 dark:text-white">
                          {plan.areaHa} {t.haUnit}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          {t.plansPage.colExpectedYield}
                        </p>
                        <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                          {plan.estimatedYieldTons} {t.tonFull}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl border px-3.5 py-2.5 ${
                        plan.estimatedProfitUzs >= 0
                          ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/40"
                          : "border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/40"
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {t.plansPage.colProfit}
                      </p>
                      <p
                        className={`text-lg font-extrabold ${
                          plan.estimatedProfitUzs >= 0
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {formatMoney(plan.estimatedProfitUzs, currency, lang)}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span>{t.plansPage.colCrop}:</span>
                        <strong className="text-slate-900 dark:text-white">{irrLabel}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.calc.costLabelShort}:</span>
                        <strong className="text-slate-900 dark:text-white">
                          {formatCompactMoney(plan.estimatedCostUzs, currency, lang)}
                        </strong>
                      </div>
                      {plan.sellingPricePerKgUzs > 0 && (
                        <div className="flex justify-between">
                          <span>{t.calc.pricePerKgShort}:</span>
                          <strong className="text-slate-900 dark:text-white">
                            {formatMoney(plan.sellingPricePerKgUzs, currency, lang)}/kg
                          </strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{t.calc.savedWaterShort}:</span>
                        <strong className="text-cyan-700 dark:text-cyan-400">
                          {new Intl.NumberFormat("uz-UZ").format(plan.waterSavedM3)} m³
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
