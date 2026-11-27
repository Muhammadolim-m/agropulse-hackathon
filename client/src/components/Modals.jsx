import { useState } from "react";
import { X, MapPin, Upload, Crosshair, ExternalLink, Navigation } from "lucide-react";
import {
  CROP_IMAGES,
  FORM_CROPS,
  FORM_REGIONS,
  REGION_COORDS,
  formatMoney,
  getGoogleMapsDirectionsUrl,
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
} from "../lib/format";

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 640;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = () => reject(new Error("Image read failed"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("File upload failed"));
    reader.readAsDataURL(file);
  });
}

export function AddLotModal({ onClose, onSubmit, user, t }) {
  const defaultGeo = REGION_COORDS["Farg'ona"];
  const [form, setForm] = useState({
    title: "",
    crop: "Pomidor",
    farmerName: user?.displayName || user?.email?.split("@")[0] || "",
    region: "Farg'ona",
    address: defaultGeo.address,
    lat: defaultGeo.lat,
    lng: defaultGeo.lng,
    imageUrl: CROP_IMAGES.Pomidor,
    quantityTons: 10,
    pricePerKg: 4500,
    marketAvgPrice: 6000,
    grade: "1-nav",
    phone: "+998 90 ",
    organic: true,
  });
  const [customImage, setCustomImage] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegionChange(nextRegion) {
    const geo = REGION_COORDS[nextRegion] || REGION_COORDS.Toshkent;
    setForm((prev) => ({
      ...prev,
      region: nextRegion,
      address: geo.address,
      lat: geo.lat,
      lng: geo.lng,
    }));
  }

  function handleCropChange(nextCrop) {
    setForm((prev) => ({
      ...prev,
      crop: nextCrop,
      imageUrl: customImage ? prev.imageUrl : CROP_IMAGES[nextCrop] || CROP_IMAGES.Pomidor,
    }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setCustomImage(true);
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    } catch (err) {
      setGpsError(err.message);
    }
  }

  function handleDetectGps() {
    if (!navigator.geolocation) {
      setGpsError(t.modals.gpsNotSupported);
      return;
    }
    setGpsError("");
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        }));
        setGpsLoading(false);
      },
      () => {
        setGpsError(t.modals.gpsDenied);
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setSubmitError(err?.message || t.toasts.actionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.modals.addLotTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <div className="relative h-36 w-full bg-slate-200 dark:bg-slate-800">
              <img
                src={form.imageUrl}
                alt={t.modals.addLotTitle}
                onError={(e) => {
                  e.currentTarget.src = CROP_IMAGES[form.crop] || CROP_IMAGES.Pomidor;
                }}
                className="h-full w-full object-cover"
              />
              <label className="absolute right-2.5 bottom-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-slate-900">
                <Upload className="h-3.5 w-3.5" />
                <span>{t.modals.uploadPhoto}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <div className="p-2.5">
              <input
                type="text"
                placeholder={t.modals.imageUrlPlaceholder}
                value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                onChange={(e) => {
                  setCustomImage(Boolean(e.target.value.trim()));
                  setForm({
                    ...form,
                    imageUrl: e.target.value || CROP_IMAGES[form.crop] || CROP_IMAGES.Pomidor,
                  });
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.modals.lotTitleLabel}
            </label>
            <input
              required
              placeholder={t.modals.lotTitlePlaceholder}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.cropLabel}
              </label>
              <select
                value={form.crop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {FORM_CROPS.map((c) => (
                  <option key={c} value={c}>
                    {t.crops[c] || c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.regionLabel}
              </label>
              <select
                value={form.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {FORM_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.modals.locationTitle}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={gpsLoading}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                >
                  <Crosshair className="h-3 w-3" />
                  <span>{gpsLoading ? t.modals.detectingGps : t.modals.detectGps}</span>
                </button>
                <a
                  href={getGoogleMapsSearchUrl(form)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700"
                >
                  <span>{t.modals.mapsShort}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <input
              required
              placeholder={t.modals.addressPlaceholder}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })}
                placeholder="Latitude"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <input
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })}
                placeholder="Longitude"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            {gpsError && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{gpsError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.farmerLabel}
              </label>
              <input
                required
                placeholder={t.modals.farmerPlaceholder}
                value={form.farmerName}
                onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.phoneLabel}
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.volumeLabel}
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                required
                value={form.quantityTons}
                onChange={(e) => setForm({ ...form, quantityTons: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.priceLabel}
              </label>
              <input
                type="number"
                min="500"
                step="100"
                required
                value={form.pricePerKg}
                onChange={(e) => setForm({ ...form, pricePerKg: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.marketPriceLabel}
              </label>
              <input
                type="number"
                min="500"
                step="100"
                required
                value={form.marketAvgPrice}
                onChange={(e) => setForm({ ...form, marketAvgPrice: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.organic}
              onChange={(e) => setForm({ ...form, organic: e.target.checked })}
              className="accent-emerald-600"
            />
            <span>{t.modals.organicLabel}</span>
          </label>

          {submitError && (
            <p className="rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? t.modals.saving : t.modals.publishBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

export function OrderModal({ lot, onClose, onSubmit, user, isAdmin, lang, currency, t }) {
  const [tons, setTons] = useState(Math.min(2, lot.quantityTons));
  const [buyerName, setBuyerName] = useState(user?.displayName || user?.email?.split("@")[0] || "");
  const [company, setCompany] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("+998 90 ");
  const [deliveryRegion, setDeliveryRegion] = useState("Toshkent");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const gross = Math.round((Number(tons) || 0) * 1000 * lot.pricePerKg);
  const fee = Math.round(gross * 0.03);
  const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setLoading(true);
    try {
      await onSubmit({
        lotId: lot._id,
        tons: Number(tons),
        buyerName,
        company,
        buyerPhone,
        deliveryRegion,
        deliveryAddress,
      });
      onClose();
    } catch (err) {
      setSubmitError(err?.message || t.toasts.actionError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.modals.orderTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/70">
          <img
            src={photoSrc}
            alt={lot.title}
            className="h-14 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900 dark:text-white">{lot.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lot.farmerName} • {formatMoney(lot.pricePerKg, currency, lang)}/kg • {t.modals.available}:{" "}
              {lot.quantityTons} {t.tonUnit}
            </p>
            <a
              href={getGoogleMapsSearchUrl(lot)}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:underline dark:text-sky-400"
            >
              <MapPin className="h-3 w-3" />
              <span>{lot.address || lot.region} (Google Maps)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.modals.orderVolume(lot.quantityTons)}
            </label>
            <input
              type="number"
              min="0.1"
              max={lot.quantityTons}
              step="0.1"
              required
              value={tons}
              onChange={(e) => setTons(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t.modals.yourName}
            </label>
            <input
              required
              placeholder={t.modals.namePlaceholder}
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.companyLabel}
              </label>
              <input
                placeholder={t.modals.companyPlaceholder}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.phoneLabel}
              </label>
              <input
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.deliveryRegionLabel}
              </label>
              <select
                value={deliveryRegion}
                onChange={(e) => setDeliveryRegion(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {FORM_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.modals.deliveryAddressLabel}
              </label>
              <input
                required
                placeholder={t.modals.deliveryAddressPlaceholder}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {submitError && (
            <p className="rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {submitError}
            </p>
          )}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs dark:border-emerald-900 dark:bg-emerald-950/50">
            <div className="flex justify-between text-slate-700 dark:text-slate-200">
              <span>{t.modals.harvestValue}:</span>
              <strong>{formatMoney(gross, currency, lang)}</strong>
            </div>
            {isAdmin && (
              <div className="mt-1 flex justify-between text-amber-800 dark:text-amber-300">
                <span>{t.modals.platformFee}:</span>
                <strong>{formatMoney(fee, currency, lang)}</strong>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? t.modals.sending : t.modals.confirmOrder}
          </button>
        </form>
      </div>
    </div>
  );
}

export function GoogleMapModal({ lot, onClose, lang, currency, t }) {
  const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-xs sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-800 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <img src={photoSrc} alt={lot.title} className="h-11 w-14 rounded-lg object-cover" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{lot.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lot.farmerName} • {lot.address || lot.region} ({lot.lat}, {lot.lng})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-80 w-full bg-slate-100 dark:bg-slate-800">
          <iframe
            title={`Google Maps - ${lot.title}`}
            src={getGoogleMapsEmbedUrl(lot)}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-3.5 dark:bg-slate-900/90">
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {t.modals.contactLabel}: <strong>{lot.phone}</strong> • {t.modals.priceShort}:{" "}
            <strong>{formatMoney(lot.pricePerKg, currency, lang)}/kg</strong>
          </span>
          <div className="flex items-center gap-2">
            <a
              href={getGoogleMapsSearchUrl(lot)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span>{t.modals.openGoogleMaps}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={getGoogleMapsDirectionsUrl(lot)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>{t.modals.directions}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
