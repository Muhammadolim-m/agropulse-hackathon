import { Package, TrendingUp, Droplets, Coins, PackageCheck, Warehouse } from "lucide-react";
import { formatCompactMoney } from "../lib/format";

export default function KpiStrip({ stats, user, isAdmin, lang, currency, t }) {
  const farmerStats = stats?.farmerStats;

  const cards = isAdmin
    ? [
        {
          label: t.kpi.activeSupply,
          value: `${stats?.totalTonsAvailable ?? 0} ${t.tonFull}`,
          sub: t.kpi.activeLotsSub(stats?.activeLots ?? 0),
          icon: Package,
          tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
        {
          label: t.kpi.directSavings,
          value: `+${stats?.avgSavingsPercent ?? 0}%`,
          sub: t.kpi.directSavingsSub,
          icon: TrendingUp,
          tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
        },
        {
          label: t.kpi.waterSaved,
          value: `${new Intl.NumberFormat("uz-UZ").format(stats?.totalWaterSavedM3 ?? 0)} m³`,
          sub: t.kpi.waterSavedSub,
          icon: Droplets,
          tone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
        },
        {
          label: t.kpi.platformRev,
          value: formatCompactMoney(stats?.totalPlatformRevenueUzs, currency, lang),
          sub: t.kpi.platformRevSub(stats?.totalOrders ?? 0),
          icon: Coins,
          tone: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
        },
      ]
    : user
    ? [
        {
          label: t.kpi.activeSupply,
          value: `${stats?.totalTonsAvailable ?? 0} ${t.tonFull}`,
          sub: t.kpi.activeLotsSub(stats?.activeLots ?? 0),
          icon: Package,
          tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
        {
          label: t.kpi.mySold,
          value: `${farmerStats?.mySoldTons ?? 0} ${t.tonFull}`,
          sub: t.kpi.mySoldSub(
            formatCompactMoney(farmerStats?.mySalesRevenueUzs ?? 0, currency, lang)
          ),
          icon: PackageCheck,
          tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
        },
        {
          label: t.kpi.myStock,
          value: `${farmerStats?.myRemainingTons ?? 0} ${t.tonFull}`,
          sub: t.kpi.myStockSub(farmerStats?.myLotsCount ?? 0),
          icon: Warehouse,
          tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
        },
        {
          label: t.kpi.waterSaved,
          value: `${new Intl.NumberFormat("uz-UZ").format(stats?.totalWaterSavedM3 ?? 0)} m³`,
          sub: t.kpi.waterSavedSub,
          icon: Droplets,
          tone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
        },
      ]
    : [
        {
          label: t.kpi.activeSupply,
          value: `${stats?.totalTonsAvailable ?? 0} ${t.tonFull}`,
          sub: t.kpi.activeLotsSub(stats?.activeLots ?? 0),
          icon: Package,
          tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
        {
          label: t.kpi.directSavings,
          value: `+${stats?.avgSavingsPercent ?? 0}%`,
          sub: t.kpi.directSavingsSub,
          icon: TrendingUp,
          tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
        },
        {
          label: t.kpi.waterSaved,
          value: `${new Intl.NumberFormat("uz-UZ").format(stats?.totalWaterSavedM3 ?? 0)} m³`,
          sub: t.kpi.waterSavedSub,
          icon: Droplets,
          tone: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
        },
        {
          label: t.kpi.marketSold,
          value: `${stats?.totalSoldTonsAll ?? 0} ${t.tonFull}`,
          sub: t.kpi.marketSoldSub,
          icon: PackageCheck,
          tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        },
      ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex items-start justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{card.sub}</p>
            </div>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.tone}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
