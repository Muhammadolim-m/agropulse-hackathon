import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { apiFetch } from "./lib/api";
import { TRANSLATIONS } from "./lib/i18n";
import { logoutFirebase, subscribeAuth } from "./lib/firebase";
import Navbar from "./components/Navbar";
import KpiStrip from "./components/KpiStrip";
import MarketplaceTab from "./components/MarketplaceTab";
import SmartCalcTab from "./components/SmartCalcTab";
import FieldPlansTab from "./components/FieldPlansTab";
import FarmerCabinetTab from "./components/FarmerCabinetTab";
import AuthModal from "./components/AuthModal";
import { AddLotModal, GoogleMapModal, OrderModal } from "./components/Modals";

const AdminPanel = lazy(() => import("./components/OrdersRevenueTab"));

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("agropulse-lang") || "uz");
  const [currency, setCurrency] = useState(() => localStorage.getItem("agropulse-currency") || "UZS");
  const [dark, setDark] = useState(() => localStorage.getItem("agropulse-theme") === "dark");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(() =>
    Boolean(sessionStorage.getItem("agropulse-admin-token"))
  );
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [activeTab, setActiveTab] = useState("market");
  const [mongoStatus, setMongoStatus] = useState("checking");
  const [stats, setStats] = useState(null);
  const [lots, setLots] = useState([]);
  const [myLots, setMyLots] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [allLots, setAllLots] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [plans, setPlans] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("Barchasi");
  const [selectedRegion, setSelectedRegion] = useState("Barchasi");

  const [showAddLot, setShowAddLot] = useState(false);
  const [orderLot, setOrderLot] = useState(null);
  const [mapLot, setMapLot] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("agropulse-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("agropulse-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("agropulse-currency", currency);
  }, [currency]);

  useEffect(() => {
    if ((!user || !isAdmin) && activeTab === "admin") {
      setActiveTab("market");
    }
  }, [user, isAdmin, activeTab]);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const syncUserToMongo = useCallback(async (fbUser, providerOverride) => {
    if (!fbUser?.uid || !fbUser?.email) {
      setUserProfile(null);
      setIsAdmin(false);
      return;
    }
    try {
      const res = await apiFetch("/api/users/sync", {
        method: "POST",
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email.split("@")[0],
          photoURL: fbUser.photoURL || "",
          provider: providerOverride || fbUser.providerData?.[0]?.providerId || "password",
        }),
      });
      setUserProfile(res.user || null);
      setIsAdmin(Boolean(res.isAdmin));
    } catch {
      // Non-blocking profile sync
    }
  }, []);

  const loadAll = useCallback(async () => {
    const params = new URLSearchParams();
    if (selectedCrop !== "Barchasi") params.set("crop", selectedCrop);
    if (selectedRegion !== "Barchasi") params.set("region", selectedRegion);
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());

    try {
      const [healthRes, dashRes, lotsRes, ordersRes, plansRes] = await Promise.all([
        apiFetch("/api/health"),
        apiFetch("/api/dashboard"),
        apiFetch(`/api/lots?${params.toString()}`),
        apiFetch("/api/orders"),
        apiFetch("/api/plans"),
      ]);

      const adminFlag = Boolean(dashRes.stats?.isAdmin);
      const unlockedFlag = Boolean(dashRes.stats?.adminUnlocked);
      if (!unlockedFlag && sessionStorage.getItem("agropulse-admin-token")) {
        sessionStorage.removeItem("agropulse-admin-token");
      }
      setMongoStatus(healthRes.mongo || "connected");
      setStats(dashRes.stats);
      setIsAdmin(adminFlag);
      setAdminUnlocked(unlockedFlag);
      setMyLots(dashRes.myLots || []);
      setMyOrders(dashRes.myIncomingOrders || []);
      setLots(lotsRes.lots || []);
      setOrders(ordersRes.orders || []);
      setPlans(plansRes.plans || []);

      if (adminFlag && unlockedFlag) {
        const [usersRes, unfilteredLotsRes] = await Promise.all([
          apiFetch("/api/admin/users"),
          apiFetch("/api/lots"),
        ]);
        setAdminUsers(usersRes.users || []);
        setAllLots(unfilteredLotsRes.lots || []);
      } else {
        setAdminUsers([]);
        setAllLots([]);
      }
    } catch (err) {
      notify(err.message || t.toasts.loadError, "error");
    }
  }, [selectedCrop, selectedRegion, debouncedSearch, notify, t.toasts.loadError]);

  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await syncUserToMongo(fbUser);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        setActiveTab((prev) => (prev === "admin" ? "market" : prev));
      }
      await loadAll();
    });
    return () => unsub();
  }, [syncUserToMongo, loadAll]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 180);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleAuthSuccess(fbUser, provider, message) {
    setUser(fbUser);
    await syncUserToMongo(fbUser, provider);
    await loadAll();
    notify(message);
    if (pendingAction?.type === "addLot") {
      setShowAddLot(true);
    } else if (pendingAction?.type === "order") {
      setOrderLot(pendingAction.lot);
    }
    setPendingAction(null);
  }

  async function handleLogout() {
    sessionStorage.removeItem("agropulse-admin-token");
    await logoutFirebase();
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    setAdminUnlocked(false);
    setActiveTab((prev) => (prev === "admin" ? "market" : prev));
    notify(t.toasts.authSignedOut);
    await loadAll();
  }

  async function handleVerifyAdminPin(e) {
    e.preventDefault();
    setPinError("");
    setPinLoading(true);
    try {
      const res = await apiFetch("/api/admin/verify-code", {
        method: "POST",
        body: JSON.stringify({ code: pinInput }),
      });
      if (res?.adminToken) {
        sessionStorage.setItem("agropulse-admin-token", res.adminToken);
        setAdminUnlocked(true);
        setPinInput("");
        notify(t.adminPanel.pinUnlockedToast);
        await loadAll();
      }
    } catch {
      setPinError(t.adminPanel.pinWrong);
    } finally {
      setPinLoading(false);
    }
  }

  function handleLockAdmin() {
    sessionStorage.removeItem("agropulse-admin-token");
    setAdminUnlocked(false);
    setAdminUsers([]);
    setAllLots([]);
  }

  async function runAction(fn, successMessage) {
    try {
      await fn();
      if (successMessage) notify(successMessage);
      await loadAll();
    } catch (err) {
      notify(err.message || t.toasts.actionError, "error");
      throw err;
    }
  }

  const handleTogglePro = async (plan) => {
    try {
      const res = await apiFetch("/api/users/subscription", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      setUserProfile(res.user);
      notify(plan === "pro" ? t.cabinet.proActivatedToast : t.cabinet.proDeactivatedToast);
      await loadAll();
    } catch (err) {
      notify(err.message || t.toasts.actionError, "error");
    }
  };

  const handleToggleUserPro = (userId, plan) =>
    runAction(
      () =>
        apiFetch(`/api/admin/users/${userId}/subscription`, {
          method: "PATCH",
          body: JSON.stringify({ plan }),
        }),
      plan === "pro" ? t.adminPanel.proGrantedToast : t.adminPanel.proRevokedToast
    ).catch(() => {});

  const handleGrantProByEmail = (email) =>
    runAction(
      () =>
        apiFetch("/api/admin/users/grant-pro", {
          method: "POST",
          body: JSON.stringify({ email, plan: "pro" }),
        }),
      t.adminPanel.proGrantedToast
    );

  const handleCreateLot = (payload) =>
    runAction(
      () => apiFetch("/api/lots", { method: "POST", body: JSON.stringify(payload) }),
      t.toasts.lotCreated
    );

  const handleDeleteLot = (id) =>
    runAction(() => apiFetch(`/api/lots/${id}`, { method: "DELETE" }), t.toasts.lotDeleted).catch(
      () => {}
    );

  const handleCreateOrder = (payload) =>
    runAction(
      () => apiFetch("/api/orders", { method: "POST", body: JSON.stringify(payload) }),
      t.toasts.orderCreated
    );

  const handleStatusChange = (orderId, status) =>
    runAction(
      () => apiFetch(`/api/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status }) }),
      t.toasts.orderStatus(t.orders.statuses[status] || status)
    ).catch(() => {});

  const handleSavePlan = (payload) =>
    runAction(
      () => apiFetch("/api/plans", { method: "POST", body: JSON.stringify(payload) }),
      t.toasts.planSaved
    )
      .then(() => setActiveTab("plans"))
      .catch(() => {});

  const handleDeletePlan = (id) =>
    runAction(() => apiFetch(`/api/plans/${id}`, { method: "DELETE" }), t.toasts.planDeleted).catch(
      () => {}
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddLotClick={() => {
          if (user) {
            setShowAddLot(true);
          } else {
            setPendingAction({ type: "addLot" });
            setShowAuth(true);
          }
        }}
        mongoStatus={mongoStatus}
        orderCount={orders.length}
        plansCount={plans.length}
        isAdmin={isAdmin}
        userProfile={userProfile}
        lang={lang}
        onLangChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        dark={dark}
        onToggleDark={() => setDark((d) => !d)}
        user={user}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
        t={t}
      />

      {toast && (
        <div
          className={`fixed right-5 bottom-5 z-50 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
            toast.type === "error" ? "bg-rose-600" : "bg-emerald-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <KpiStrip
          stats={stats}
          user={user}
          isAdmin={isAdmin && adminUnlocked}
          lang={lang}
          currency={currency}
          t={t}
        />

        {activeTab === "market" && (
          <MarketplaceTab
            lots={lots}
            search={search}
            onSearchChange={setSearch}
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            onOrderClick={(lot) => {
              if (user) {
                setOrderLot(lot);
              } else {
                setPendingAction({ type: "order", lot });
                setShowAuth(true);
              }
            }}
            onMapClick={(lot) => setMapLot(lot)}
            onDeleteLot={handleDeleteLot}
            user={user}
            isAdmin={isAdmin}
            lang={lang}
            currency={currency}
            t={t}
          />
        )}

        {activeTab === "calc" && (
          <SmartCalcTab
            plansCount={plans.length}
            onSavePlan={handleSavePlan}
            onOpenPlansPage={() => setActiveTab("plans")}
            lang={lang}
            currency={currency}
            onCurrencyChange={setCurrency}
            t={t}
          />
        )}

        {activeTab === "plans" && (
          <FieldPlansTab
            plans={plans}
            onDeletePlan={handleDeletePlan}
            onGoToCalc={() => setActiveTab("calc")}
            lang={lang}
            currency={currency}
            t={t}
          />
        )}

        {activeTab === "farmer" && (
          <FarmerCabinetTab
            user={user}
            userProfile={userProfile}
            myLots={myLots}
            myOrders={myOrders}
            farmerStats={stats?.farmerStats}
            onOpenAuth={() => setShowAuth(true)}
            onTogglePro={handleTogglePro}
            onStatusChange={handleStatusChange}
            lang={lang}
            currency={currency}
            t={t}
          />
        )}

        {activeTab === "admin" && user && isAdmin && !adminUnlocked && (
          <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-lg dark:border-amber-900/60 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
              {t.adminPanel.pinTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.adminPanel.pinSubtitle}
            </p>
            <form onSubmit={handleVerifyAdminPin} className="mt-4 space-y-3">
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={t.adminPanel.pinPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-base font-bold tracking-[0.25em] outline-none focus:border-amber-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {pinError && (
                <p className="rounded-xl bg-rose-50 p-2 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {pinError}
                </p>
              )}
              <button
                type="submit"
                disabled={pinLoading}
                className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
              >
                {pinLoading ? t.adminPanel.pinChecking : t.adminPanel.pinSubmit}
              </button>
            </form>
          </div>
        )}

        {activeTab === "admin" && user && isAdmin && adminUnlocked && (
          <Suspense fallback={null}>
            <AdminPanel
              orders={orders}
              lots={allLots}
              adminUsers={adminUsers}
              stats={stats}
              onStatusChange={handleStatusChange}
              onDeleteLot={handleDeleteLot}
              onToggleUserPro={handleToggleUserPro}
              onGrantProByEmail={handleGrantProByEmail}
              onLockAdmin={handleLockAdmin}
              lang={lang}
              currency={currency}
              t={t}
            />
          </Suspense>
        )}
      </main>

      {showAuth && (
        <AuthModal
          onClose={() => {
            setShowAuth(false);
            setPendingAction(null);
          }}
          onAuthSuccess={handleAuthSuccess}
          t={t}
        />
      )}

      {showAddLot && (
        <AddLotModal
          onClose={() => setShowAddLot(false)}
          onSubmit={handleCreateLot}
          user={user}
          t={t}
        />
      )}

      {orderLot && (
        <OrderModal
          lot={orderLot}
          onClose={() => setOrderLot(null)}
          onSubmit={handleCreateOrder}
          user={user}
          isAdmin={isAdmin}
          lang={lang}
          currency={currency}
          t={t}
        />
      )}

      {mapLot && (
        <GoogleMapModal
          lot={mapLot}
          onClose={() => setMapLot(null)}
          lang={lang}
          currency={currency}
          t={t}
        />
      )}
    </div>
  );
}
