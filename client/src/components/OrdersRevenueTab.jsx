import { useState } from "react";
import { Coins, CheckCircle2, Truck, Clock, Crown, Trash2, Search, UserPlus } from "lucide-react";
import { CROP_IMAGES, formatCompactMoney, formatMoney } from "../lib/format";

const STATUS_STEPS = ["Yangi", "Tasdiqlangan", "Yetkazilmoqda"];

export default function OrdersRevenueTab({
  orders,
  lots,
  adminUsers,
  stats,
  onStatusChange,
  onDeleteLot,
  onToggleUserPro,
  onGrantProByEmail,
  lang,
  currency,
  t,
}) {
  const [lotQuery, setLotQuery] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  const filteredLots = (lots || []).filter((l) => {
    const q = lotQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      l.title.toLowerCase().includes(q) ||
      l.crop.toLowerCase().includes(q) ||
      l.farmerName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q)
    );
  });

  async function handleGrantSubmit(e) {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGrantLoading(true);
    try {
      await onGrantProByEmail(grantEmail.trim());
      setGrantEmail("");
    } catch {
      // Error toast displayed by parent
    } finally {
      setGrantLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/60 dark:from-amber-950/40 dark:to-slate-900">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
            <Coins className="h-4 w-4" />
            <span>{t.orders.monetizationTitle}</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatMoney(stats?.totalPlatformRevenueUzs, currency, lang)}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            {t.orders.gmvLabel}: {formatCompactMoney(stats?.totalGmvUzs, currency, lang)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            {t.orders.saasTitle}
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{t.orders.saasPrice}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Pro: {stats?.proSubscribers ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{t.orders.saasDesc}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-400">
            {t.orders.partnerTitle}
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{t.orders.partnerPrice}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{t.orders.partnerDesc}</p>
        </div>
      </div>

      {/* Farmers & Premium Status Control */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.adminPanel.farmersTitle((adminUsers || []).length)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.adminPanel.farmersSub}</p>
          </div>

          <form onSubmit={handleGrantSubmit} className="flex w-full gap-2 md:w-auto">
            <input
              type="email"
              required
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder={t.adminPanel.grantEmailPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-amber-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white md:w-72"
            />
            <button
              type="submit"
              disabled={grantLoading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>{t.adminPanel.grantBtn}</span>
            </button>
          </form>
        </div>

        {(adminUsers || []).length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t.adminPanel.noFarmers}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {adminUsers.map((u) => {
              const isPro = u.subscriptionPlan === "pro";
              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {u.photoURL ? (
                      <img
                        src={u.photoURL}
                        alt={u.displayName || u.email}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                        {(u.displayName || u.email || "?").slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {u.displayName || u.email}
                        </p>
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            isPro
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {isPro && <Crown className="h-2.5 w-2.5" />}
                          {isPro ? t.adminPanel.proBadge : t.adminPanel.freeBadge}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {u.email} • {u.lotsCount || 0} lot ({u.remainingTons || 0} {t.tonUnit})
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleUserPro(u._id, isPro ? "free" : "pro")}
                    className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      isPro
                        ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                        : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    }`}
                  >
                    {isPro ? t.adminPanel.revokePro : t.adminPanel.givePro}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Harvest Lots Moderation (Delete any lot) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t.adminPanel.lotsModerationTitle((lots || []).length)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.adminPanel.lotsModerationSub}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={lotQuery}
              onChange={(e) => setLotQuery(e.target.value)}
              placeholder={t.adminPanel.searchLotsPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-8 text-xs outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredLots.map((lot) => {
            const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;
            return (
              <div
                key={lot._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src={photoSrc}
                    alt={lot.title}
                    className="h-11 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {lot.title}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {lot.farmerName} • {lot.region}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {lot.quantityTons} {t.tonUnit} • {formatMoney(lot.pricePerKg, currency, lang)}/kg
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteLot(lot._id)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white dark:bg-rose-950/60 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t.adminPanel.deleteBtn}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* B2B Orders Journal */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t.orders.journalTitle(orders.length)}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.orders.journalSub}</p>
        </div>

        {orders.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.orders.emptyOrders}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60 md:flex-row md:items-center"
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
                  {(order.deliveryAddress || order.deliveryRegion) && (
                    <p className="mt-0.5 text-xs text-sky-700 dark:text-sky-400">
                      {t.modals.deliveryToLabel}:{" "}
                      <strong>
                        {[order.deliveryRegion, order.deliveryAddress].filter(Boolean).join(", ")}
                      </strong>
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.orders.dealSumLabel}:{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {formatMoney(order.grossAmount, currency, lang)}
                    </strong>{" "}
                    •{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                      {t.orders.commissionLabel}: {formatMoney(order.platformFee, currency, lang)}
                    </span>
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
                            : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
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
    </div>
  );
}
