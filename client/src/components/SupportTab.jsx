import { useState } from "react";
import { LifeBuoy, Send, MessageSquare, CheckCircle2, Clock } from "lucide-react";

export default function SupportTab({ user, myTickets, onSendSupport, t }) {
  const [senderName, setSenderName] = useState(
    user?.displayName || user?.email?.split("@")[0] || ""
  );
  const [senderEmail, setSenderEmail] = useState(user?.email || "");
  const [senderPhone, setSenderPhone] = useState("+998 90 ");
  const [topic, setTopic] = useState(t.supportPage.topics[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const currentTopic = t.supportPage.topics.includes(topic) ? topic : t.supportPage.topics[0];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;
    setSending(true);
    try {
      await onSendSupport({
        senderName,
        senderEmail: user?.email || senderEmail,
        senderPhone,
        topic: currentTopic,
        message,
      });
      setMessage("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-7"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.supportPage.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.supportPage.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.supportPage.nameLabel}
            </label>
            <input
              type="text"
              required
              placeholder={t.supportPage.namePlaceholder}
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.supportPage.phoneLabel}
            </label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.supportPage.emailLabel}
            </label>
            <input
              type="email"
              value={user?.email || senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              disabled={Boolean(user?.email)}
              placeholder="name@gmail.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.supportPage.topicLabel}
            </label>
            <select
              value={currentTopic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {t.supportPage.topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t.supportPage.messageLabel}
          </label>
          <textarea
            rows={4}
            required
            placeholder={t.supportPage.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span>{sending ? t.supportPage.sendingBtn : t.supportPage.sendBtn}</span>
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.supportPage.myTicketsTitle} ({(myTickets || []).length})
          </h3>
        </div>

        {(myTickets || []).length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t.supportPage.noTickets}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {myTickets.map((item) => {
              const replied = item.status === "Javob berildi";
              return (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {item.topic}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        replied
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {replied ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {replied ? t.supportPage.statusReplied : t.supportPage.statusNew}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{item.message}</p>
                  {item.adminReply && (
                    <div className="mt-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
                      <strong>{t.supportPage.adminReplyLabel}</strong> {item.adminReply}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
