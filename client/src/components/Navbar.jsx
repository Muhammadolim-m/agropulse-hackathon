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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <>
      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  AgroPulse
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isConnected
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800"
                      : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800"
                  }`}
                >
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">{isConnected ? t.mongoLive : t.connecting}</span>
                  <span className="sm:hidden">●</span>
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 lg:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop tab nav (lg+) */}
          <nav className="hidden items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800 lg:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.id === "plans" && plansCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {plansCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Currency + Lang (md+) */}
            <div className="hidden items-center gap-1.5 md:flex">
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
            </div>

            {/* Dark toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              title={dark ? t.themeLight : t.themeDark}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User / Login */}
            {user ? (
              <div
                onClick={() => {
                  onTabChange("profile");
                  setMenuOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onTabChange("profile");
                    setMenuOpen(false);
                  }
                }}
                title={t.tabs.profile}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1 pr-1.5 pl-2 transition hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-700"
              >
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
                <span className="hidden max-w-[80px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200 sm:inline">
                  {userLabel}
                </span>
                {isPro && (
                  <span className="hidden items-center gap-0.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 sm:inline-flex">
                    <Crown className="h-3 w-3" />
                    PRO
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                  }}
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
                <span className="hidden sm:inline">{t.auth.openBtn}</span>
              </button>
            )}

            {/* Add lot */}
            <button
              onClick={onAddLotClick}
              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.addHarvest}</span>
            </button>

            {/* Mobile hamburger for settings drawer */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile settings drawer */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                {CURRENCY_BTNS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { onCurrencyChange(item.id); }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
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
                    onClick={() => { onLangChange(item.id); }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                      lang === item.id
                        ? "bg-white text-emerald-700 shadow-2xs dark:bg-slate-900 dark:text-emerald-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── BOTTOM TAB BAR — mobile only (< lg) ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/97 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/97 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMenuOpen(false); }}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                  active
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
                <Icon className={`h-5 w-5 transition-transform ${active ? "scale-110" : ""}`} />
                <span className="max-w-[52px] truncate leading-none">{tab.label}</span>
                {tab.id === "plans" && plansCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-extrabold text-white">
                    {plansCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
