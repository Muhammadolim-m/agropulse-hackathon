import { MapPin, Sprout, Trash2, Plus, LogIn, Crown, Package, Ruler, ExternalLink } from "lucide-react";
import { CROP_IMAGES, formatCompactMoney, formatMoney, getGoogleMapsSearchUrl } from "../lib/format";

export default function ProfileTab({
  user,
  userProfile,
  myLots,
  myPlans,
  farmerStats,
  onOpenAuth,
  onAddLotClick,
  onAddFieldClick,
  onDeleteLot,
  onDeletePlan,
  lang,
  currency,
  t,
}) {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-8 text-center dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 sm:flex-row sm:text-left">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.profilePage.loginPromptTitle}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {t.profilePage.loginPromptSub}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAuth}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <LogIn className="h-4 w-4" />
          <span>{t.auth.openBtn}</span>
        </button>
      </div>
    );
  }

  const isPro = userProfile?.subscriptionPlan === "pro";
  const displayName = user.displayName || user.email?.split("@")[0] || "Fermer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-extrabold text-white">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{displayName}</h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isPro
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {isPro && <Crown className="h-3.5 w-3.5" />}
                {isPro ? t.profilePage.planPro : t.profilePage.planFree}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddFieldClick}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.profilePage.addFieldBtn.replace(/^\+\s*/, "")}</span>
          </button>
          <button
            type="button"
            onClick={onAddLotClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.profilePage.addLotBtn.replace(/^\+\s*/, "")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-slate-900">
          <div>
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {t.profilePage.fieldsCountLabel}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
              {myPlans.length}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {t.profilePage.fieldsCountSub(farmerStats?.myTotalAreaHa ?? 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Ruler className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-start justify-between rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-900/60 dark:from-sky-950/40 dark:to-slate-900">
          <div>
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
              {t.profilePage.lotsCountLabel}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
              {myLots.length}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {t.profilePage.lotsCountSub(farmerStats?.myRemainingTons ?? 0)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white">
            <Package className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* My Harvest Lots with Delete */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.profilePage.myLotsTitle} ({myLots.length})
          </h3>
          <button
            type="button"
            onClick={onAddLotClick}
            className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            {t.profilePage.addLotBtn}
          </button>
        </div>

        {myLots.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t.profilePage.noLots}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {myLots.map((lot) => {
              const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;
              return (
                <div
                  key={lot._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={photoSrc}
                      alt={lot.title}
                      className="h-14 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {lot.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.crops[lot.crop] || lot.crop} • {formatMoney(lot.pricePerKg, currency, lang)}/kg
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {t.cabinet.soldCol}: {lot.soldTons || 0} {t.tonUnit}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          • {t.cabinet.leftCol}: {lot.quantityTons} {t.tonUnit}
                        </span>
                        <a
                          href={getGoogleMapsSearchUrl(lot)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-sky-700 hover:underline dark:text-sky-400"
                        >
                          <MapPin className="h-3 w-3" />
                          <span>{lot.region}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteLot(lot._id)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.profilePage.deleteLotBtn}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Fields List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.profilePage.myFieldsTitle} ({myPlans.length})
          </h3>
          <button
            type="button"
            onClick={onAddFieldClick}
            className="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
          >
            {t.profilePage.addFieldBtn}
          </button>
        </div>

        {myPlans.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t.profilePage.noFields}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {myPlans.map((plan) => (
              <div
                key={plan._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{plan.fieldName}</span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {t.crops[plan.crop] || plan.crop} • {plan.areaHa} {t.haUnit}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {plan.region} • {t.plansPage.colExpectedYield}:{" "}
                    <strong>
                      {plan.estimatedYieldTons} {t.tonFull}
                    </strong>{" "}
                    • {t.calc.profitShort}:{" "}
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {formatCompactMoney(plan.estimatedProfitUzs, currency, lang)}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeletePlan(plan._id)}
                  title={t.market.deleteLot}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
