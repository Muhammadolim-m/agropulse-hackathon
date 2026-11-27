import { Coins, CheckCircle2, Truck, Clock } from "lucide-react";
import { formatCompactMoney, formatMoney } from "../lib/format";

const STATUS_STEPS = ["Yangi", "Tasdiqlangan", "Yetkazilmoqda"];

export default function OrdersRevenueTab({ orders, stats, onStatusChange, lang, currency, t }) {
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
