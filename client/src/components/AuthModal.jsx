import { useState } from "react";
import { X, Mail, Lock, User, Sparkles } from "lucide-react";
import {
  loginWithEmail,
  loginWithGoogle,
  registerOrSignInWithEmail,
} from "../lib/firebase";

export default function AuthModal({ onClose, onAuthSuccess, t }) {
  const [tab, setTab] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatAuthError(err, isRegister) {
    const code = err?.code || "";
    if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
      return isRegister ? t.auth.wrongPassword : t.auth.invalidCreds;
    }
    if (code === "auth/weak-password") {
      return t.auth.weakPassword;
    }
    if (code === "auth/popup-closed-by-user") {
      return t.auth.popupClosed;
    }
    return err?.message || t.toasts.actionError;
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      await onAuthSuccess(user, "google", t.toasts.authSignedIn);
      onClose();
    } catch (err) {
      setError(formatAuthError(err, false));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "register") {
        const { user, mode } = await registerOrSignInWithEmail({ name, email, password });
        const msg =
          mode === "auto-signed-in" ? t.toasts.authAutoSignedIn : t.toasts.authRegistered;
        await onAuthSuccess(user, "password", msg);
      } else {
        const user = await loginWithEmail({ email, password });
        await onAuthSuccess(user, "password", t.toasts.authSignedIn);
      }
      onClose();
    } catch (err) {
      setError(formatAuthError(err, tab === "register"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.auth.title}</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t.auth.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.08.72-2.46 1.15-4.22 1.15-3.24 0-5.99-2.19-6.97-5.14H1.02v3.14C3.03 21.13 7.21 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.03 14c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29V6.28H1.02A11.98 11.98 0 0 0 0 11.71c0 1.93.46 3.76 1.02 5.43l4.01-3.14Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.58c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.09 15.3 0 12 0 7.21 0 3.03 2.87 1.02 6.28l4.01 3.14C6.01 6.77 8.76 4.58 12 4.58Z"
            />
          </svg>
          <span>{t.auth.googleBtn}</span>
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-medium text-slate-400">{t.auth.orDivider}</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError("");
            }}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              tab === "register"
                ? "bg-white text-emerald-700 shadow-2xs dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
            }`}
          >
            {t.auth.registerTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className={`rounded-lg py-2 text-xs font-bold transition ${
              tab === "login"
                ? "bg-white text-emerald-700 shadow-2xs dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
            }`}
          >
            {t.auth.loginTab}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {tab === "register" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.auth.nameLabel}
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.auth.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.auth.emailLabel}
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2.5 pr-3.5 pl-9 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {tab === "register" && (
            <p className="flex items-start gap-1.5 rounded-xl bg-emerald-50 p-2.5 text-[11px] leading-relaxed text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{t.auth.autoNote}</span>
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-rose-50 p-2.5 text-xs font-medium text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading
              ? t.modals.saving
              : tab === "register"
              ? t.auth.registerSubmit
              : t.auth.loginSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}
