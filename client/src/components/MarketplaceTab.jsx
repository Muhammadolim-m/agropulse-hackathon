import { Search, MapPin, ShieldCheck, ShoppingBag, Trash2, Phone, ExternalLink, Map } from "lucide-react";
import {
  CROPS,
  CROP_IMAGES,
  REGIONS,
  formatMoney,
  getGoogleMapsSearchUrl,
} from "../lib/format";

export default function MarketplaceTab({
  lots,
  search,
  onSearchChange,
  selectedCrop,
  onCropChange,
  selectedRegion,
  onRegionChange,
  onOrderClick,
  onMapClick,
  onDeleteLot,
  user,
  isAdmin,
  lang,
  currency,
  t,
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.market.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {t.market.regionPrefix}: {region === "Barchasi" ? t.market.all : region}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CROPS.map((crop) => {
            const active = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => onCropChange(crop)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {t.crops[crop] || crop}
              </button>
            );
          })}
        </div>
      </div>

      {lots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">{t.market.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.market.emptySub}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => {
            const savingsPct = Math.max(
              0,
              Math.round(((lot.marketAvgPrice - lot.pricePerKg) / lot.marketAvgPrice) * 100)
            );
            const soldOut = lot.quantityTons <= 0;
            const photoSrc = lot.imageUrl || CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;

            return (
              <article
                key={lot._id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={photoSrc}
                      alt={lot.title}
                      onError={(e) => {
                        e.currentTarget.src = CROP_IMAGES[lot.crop] || CROP_IMAGES.Pomidor;
                      }}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-transparent p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                          {t.crops[lot.crop] || lot.crop}
                        </span>
                        <span className="rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow-xs dark:bg-slate-900/90 dark:text-slate-100">
                          {lot.grade}
                        </span>
                        {lot.organic && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-lime-400/95 px-2 py-1 text-xs font-bold text-lime-950 shadow-xs">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {t.market.organic}
                          </span>
                        )}
                      </div>

                      {(isAdmin || (user && lot.ownerUid === user.uid)) && (
                        <button
                          onClick={() => onDeleteLot(lot._id)}
                          title={t.market.deleteLot}
                          className="rounded-lg bg-white/90 p-1.5 text-slate-600 shadow-xs transition hover:bg-rose-600 hover:text-white dark:bg-slate-900/90 dark:text-slate-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pb-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{lot.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                      {lot.farmerName}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span className="line-clamp-1 font-medium">
                            {lot.address || lot.region}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {lot.phone}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onMapClick(lot)}
                            className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800 dark:hover:bg-sky-900/60"
                          >
                            <Map className="h-3 w-3" />
                            <span>{t.market.onMap}</span>
                          </button>
                          <a
                            href={getGoogleMapsSearchUrl(lot)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <span>{t.market.googleMaps}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 p-5 pt-4 dark:border-slate-800">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 line-through">
                          {formatMoney(lot.marketAvgPrice, currency, lang)}
                        </span>
                        {savingsPct > 0 && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                            {t.market.cheaperBadge(savingsPct)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xl font-extrabold text-slate-900 dark:text-white">
                        {formatMoney(lot.pricePerKg, currency, lang)}
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {" "}
                          {t.market.perKg}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.market.inStock}</p>
                      <p
                        className={`text-sm font-bold ${
                          soldOut ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {soldOut ? t.market.soldOut : `${lot.quantityTons} ${t.tonUnit}`}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={soldOut}
                    onClick={() => onOrderClick(lot)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{soldOut ? t.market.soldOutBtn : t.market.orderBtn}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
