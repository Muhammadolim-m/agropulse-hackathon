# AgroPulse — Vositachisiz B2B Agro-Bozor & Aqlli Dala Kalkulyatori

**AgroPulse** — qishloq xo'jaligi mahsulotlarini vositachilarsiz to'g'ridan-to'g'ri B2B savdoga chiqaruvchi hamda fermerlar uchun suv va foyda iqtisodiyotini hisoblab beruvchi fullstack AgriTech platforma.

---

## Qanday muammolarni hal qiladi?

1. **Vositachilar va narx noaniqligi muammosi**
   - *Muammo:* Fermerlar hosilini dalada o'rtakashlarga arzon narxda sotishga majbur bo'ladi, supermarket va eksportchilar esa mahsulotni 25–40% qimmat oladi.
   - *Yechim:* **To'g'ridan-to'g'ri B2B Agro-Bozor** orqali fermer hosil lotini rasmi, narxi, hajmi va sifat darajasi bilan joylaydi, xaridor esa **1 klikda** daladan buyurtma beradi.

2. **Suv va o'g'it resurslarining isrof bo'lishi**
   - *Muammo:* Ko'plab xo'jaliklarda sug'orish va o'g'itlash me'yori taxminan qilinadi, natijada suv isrof bo'ladi va sof foyda oldindan ko'rinmaydi.
   - *Yechim:* **Aqlli Suv & Foyda Kalkulyatori** ekin turi, gektar va sug'orish texnologiyasiga (`Tomchilatib`, `Yomg'irlatib`, `Ariq`) qarab kerakli suv, **tejaladigan suv hajmi (-40% gacha)**, o'g'it me'yori, taxminiy hosil va **ROI / sof foydani** hisoblab MongoDB'ga saqlaydi.

3. **Dala joylashuvi va olib ketish (logistika) qiyinchiligi**
   - *Muammo:* Xaridorlar mahsulot aynan qaysi tuman/dalada ekanini topishda qiynaladi.
   - *Yechim:* Har bir lot **Google Maps** lokatsiyasi (xarita ko'rinishi va marshrut yo'nalishi) bilan birga beriladi.

---

## Bu loyiha kimlar uchun?

- **Fermerlar va dehqon xo'jaliklari:** Hosilni vositachisiz qimmatroq sotish, rasm va GPS manzil bilan xaridor topish hamda dala foydasini oldindan rejalash uchun.
- **Ulgurji xaridorlar, supermarketlar va eksportchilar:** Hudud, ekin turi va sifat bo'yicha to'g'ridan-to'g'ri fermerdan arzonroq narxda mahsulot buyurtma qilish va Google Maps orqali yuk olish manzilini ko'rish uchun.
- **Agro-klasterlar va agronomlar:** Turli hududlardagi dala rejalarini taqqoslash va suv tejovchi sug'orishga o'tish samaradorligini baholash uchun.

---

## Biznes model (Monetizatsiya)

- **3% bitim komissiyasi:** Platforma orqali amalga oshirilgan har bir B2B buyurtmadan avtomatik hisoblanadi.
- **Pro Fermer SaaS obunasi:** Yirik xo'jaliklar uchun cheksiz dala rejalari va lotlarni yuqoriga chiqarish.
- **Agro-hamkorlik:** Tomchilatib sug'orish, urug'lik va texnika yetkazuvchilardan hamkorlik bonusi.

---

## Texnologiyalar

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Google Maps Embed & Directions
- **Backend:** Node.js, Express 5, Mongoose
- **Ma'lumotlar bazasi:** MongoDB Atlas
- **Deploy:** Vercel Services (Frontend + Backend API)

## Lokal ishga tushirish

```bash
npm install
npm --prefix server install
npm --prefix client install
# Kerakli muhit o'zgaruvchilarini sozlang va ishga tushiring:
npm run dev
```
