import {
  Sprout,
  Store,
  Calculator,
  ClipboardList,
  Warehouse,
  UserCircle,
  LifeBuoy,
  Plus,
  CheckCircle2,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Crown,
} from "lucide-react";

const LANGS = [
  { id: "uz", label: "UZ" },
  { id: "en", label: "EN" },
  { id: "ru", label: "RU" },
];

const CURRENCY_BTNS = [
  { id: "UZS", label: "so'm" },
  { id: "USD", label: "$" },
  { id: "RUB", label: "₽" },
];

export default function Navbar({
  activeTab,
  onTabChange,
  onAddLotClick,
  mongoStatus,
  plansCount,
  userProfile,
  lang,
  onLangChange,
  currency,
  onCurrencyChange,
  dark,
  onToggleDark,
  user,
  onOpenAuth,
  onLogout,
  t,
}) {
  const isConnected = mongoStatus === "connected";
  const isPro = userProfile?.subscriptionPlan === "pro";

  const tabs = [
    { id: "market", label: t.tabs.market, icon: Store },
    { id: "calc", label: t.tabs.calc, icon: Calculator },
    { id: "plans", label: t.tabs.plans, icon: ClipboardList },
    { id: "farmer", label: t.tabs.farmer, icon: Warehouse },
    { id: "profile", label: t.tabs.profile, icon: UserCircle },
    { id: "support", label: t.tabs.support, icon: LifeBuoy },
  ];

  const userLabel = user?.displayName || user?.email?.split("@")[0] || "";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AgroPulse
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  isConnected
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                {isConnected ? t.mongoLive : t.connecting}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.brandSubtitle}</p>
          </div>
        </div>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800 lg:order-2 lg:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm lg:flex-initial ${
                  active
                    ? "bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.id === "plans" && plansCount > 0 && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    {plansCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="order-2 flex flex-wrap items-center gap-1.5 lg:order-3">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {CURRENCY_BTNS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onCurrencyChange(item.id)}
                className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                  currency === item.id
                    ? "bg-white text-amber-700 shadow-2xs dark:bg-slate-900 dark:text-amber-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {LANGS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onLangChange(item.id)}
                className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                  lang === item.id
                    ? "bg-white text-emerald-700 shadow-2xs dark:bg-slate-900 dark:text-emerald-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleDark}
            title={dark ? t.themeLight : t.themeDark}
            aria-label={dark ? t.themeLight : t.themeDark}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1 pr-1.5 pl-2 dark:border-slate-700 dark:bg-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={userLabel}
                  className="h-6 w-6 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                  {userLabel.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="hidden max-w-[90px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200 sm:inline">
                {userLabel}
              </span>
              {isPro && (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  <Crown className="h-3 w-3" />
                  PRO
                </span>
              )}
              <button
                type="button"
                onClick={onLogout}
                title={t.auth.logoutBtn}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <LogIn className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.auth.openBtn}</span>
            </button>
          )}

          <button
            onClick={onAddLotClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.addHarvest}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
