import { PackageCheck, Warehouse, ShoppingCart, Crown, Check, LogIn, Clock, CheckCircle2, Truck } from "lucide-react";
import { CROP_IMAGES, formatCompactMoney, formatMoney } from "../lib/format";

const STATUS_STEPS = ["Yangi", "Tasdiqlangan", "Yetkazilmoqda"];

export default function FarmerCabinetTab({
  user,
  userProfile,
  myLots,
  myOrders,
  farmerStats,
  onOpenAuth,
  onTogglePro,
  onStatusChange,
  lang,
  currency,
  t,
}) {
  const isPro = userProfile?.subscriptionPlan === "pro";

  return (
    <div className="space-y-6">
      {!user ? (
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-6 text-center dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.cabinet.loginPromptTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {t.cabinet.loginPromptSub}
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
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-start justify-between rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-slate-900">
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {t.cabinet.soldTotalLabel}
                </p>
                <p className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {farmerStats?.mySoldTons ?? 0} {t.tonFull}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {t.cabinet.soldTotalSub(
                    formatCompactMoney(farmerStats?.mySalesRevenueUzs ?? 0, currency, lang)
                  )}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-sky-900/60 dark:from-sky-950/40 dark:to-slate-900">
              <div>
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                  {t.cabinet.remainingStockLabel}
                </p>
                <p className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {farmerStats?.myRemainingTons ?? 0} {t.tonFull}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {t.cabinet.remainingStockSub(farmerStats?.myLotsCount ?? 0)}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
                <Warehouse className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.cabinet.ordersIncomingLabel}
                </p>
                <p className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {myOrders.length}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t.cabinet.ordersIncomingSub}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.cabinet.myInventoryTitle} ({myLots.length})
            </h3>
            {myLots.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.cabinet.emptyLots}</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {myLots.map((lot) => {
                  const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;
                  return (
                    <div
                      key={lot._id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={photoSrc}
                          alt={lot.title}
                          className="h-12 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900 dark:text-white">{lot.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.crops[lot.crop] || lot.crop} • {formatMoney(lot.pricePerKg, currency, lang)}/kg
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-xs">
                        <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {t.cabinet.soldCol}: {lot.soldTons || 0} {t.tonUnit}
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {t.cabinet.leftCol}: {lot.quantityTons} {t.tonUnit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.cabinet.myOrdersTitle} ({myOrders.length})
            </h3>
            {myOrders.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t.cabinet.noIncomingOrders}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {myOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 md:flex-row md:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{order.lotTitle}</span>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {order.tons} {t.tonFull}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {t.orders.buyerLabel}: <strong>{order.buyerName}</strong> ({order.company}) •{" "}
                        {order.buyerPhone}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {t.orders.dealSumLabel}: {formatMoney(order.grossAmount, currency, lang)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {STATUS_STEPS.map((st) => {
                        const active = order.status === st;
                        const Icon = st === "Yangi" ? Clock : st === "Tasdiqlangan" ? CheckCircle2 : Truck;
                        return (
                          <button
                            key={st}
                            onClick={() => onStatusChange(order._id, st)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                              active
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{t.orders.statuses[st] || st}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="relative overflow-hidden rounded-2xl border border-amber-300/70 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 p-6 text-white shadow-lg dark:border-amber-700/60">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/30">
                <Crown className="h-3.5 w-3.5" />
                {isPro ? t.cabinet.proActiveBadge : t.cabinet.proBannerBadge}
              </span>
              <span className="text-sm font-bold text-amber-200">{t.cabinet.proPrice}</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold tracking-tight">{t.cabinet.proTitle}</h3>
              <p className="mt-1 text-sm text-slate-300">{t.cabinet.proSubtitle}</p>
            </div>

            <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
              {t.cabinet.proFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-xs text-slate-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => onTogglePro(isPro ? "free" : "pro")}
                className={`w-full rounded-xl px-5 py-3 text-sm font-bold shadow-md transition lg:w-auto ${
                  isPro
                    ? "bg-white/15 text-white ring-1 ring-white/25 hover:bg-white/25"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400"
                }`}
              >
                {isPro ? t.cabinet.switchFreeBtn : t.cabinet.activateProBtn}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:from-amber-300 hover:to-amber-400 lg:w-auto"
              >
                <Crown className="h-4 w-4" />
                <span>{t.cabinet.activateProBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
