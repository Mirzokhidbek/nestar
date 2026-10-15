# Nestar loyihasi — hozirgacha qilingan ishlar

> Holat: 2026-10-15. Bu fayl loyihada nima qilinganini va har bir qism nima uchun kerakligini sodda tilda tushuntiradi.

---

## 1. Loyiha nima haqida?

**Nestar** — ko'chmas mulk (uy, kvartira, ofis va h.k.) e'lonlari platformasining **backend** qismi.
Foydalanuvchilar ro'yxatdan o'tadi, agentlar mulk e'lonlarini joylaydi, boshqalar ularni ko'radi, like bosadi, izoh yozadi, bir-biriga obuna bo'ladi.

---

## 2. Ishlatilgan texnologiyalar

| Texnologiya | Nima uchun |
|---|---|
| **NestJS 10** | Backend framework (TypeScript asosida, modulli tuzilma) |
| **GraphQL + Apollo** | API — REST o'rniga bitta `/graphql` endpoint orqali so'rovlar |
| **MongoDB + Mongoose** | Ma'lumotlar bazasi va u bilan ishlash kutubxonasi |
| **@nestjs/config** | `.env` fayldan sozlamalarni o'qish |
| **class-validator** | Kiruvchi ma'lumotlarni tekshirish (validatsiya) |
| **Prettier / ESLint** | Kod formatlash va sifat nazorati |

Hali o'rnatilgan, lekin **ishlatilmagan** kutubxonalar (keyingi bosqichlar uchun):
`@nestjs/jwt` + `bcryptjs` (login/parol), `graphql-upload` (rasm yuklash), `socket.io`/`ws` (real-time bildirishnomalar), `@nestjs/schedule` (rejali vazifalar), `moment`, `axios`.

---

## 3. Monorepo tuzilmasi — ikkita server

Loyiha **monorepo** — bitta repoda ikkita alohida dastur:

```
nestar/
├── apps/
│   ├── nestars-api/     ← Asosiy API server (port 3007)
│   └── nestars-batch/   ← Fon vazifalari serveri (port 3008)
├── .env                 ← Maxfiy sozlamalar (git'ga tushmaydi)
├── .env.example         ← Sozlamalar namunasi
└── nest-cli.json        ← Monorepo konfiguratsiyasi
```

- **nestars-api** — foydalanuvchi bilan ishlaydigan asosiy server. Hozircha asosiy ish shu yerda.
- **nestars-batch** — kelajakda rejali ishlar uchun (masalan, har kuni reytinglarni hisoblash). Hozircha faqat "Hello" qaytaradi.

### Ishga tushirish

```bash
npm run start:dev         # API server (http://localhost:3007)
npm run start:dev:batch   # Batch server (http://localhost:3008)
```

GraphQL Playground: `http://localhost:3007/graphql`

---

## 4. API server ichki tuzilmasi

```
apps/nestars-api/src/
├── main.ts                 ← Serverni ishga tushiradi
├── app.module.ts           ← Bosh modul — hammasini birlashtiradi
├── app.controller.ts       ← GET / → "Hello from Nestars API Server!"
├── database/
│   └── database.module.ts  ← MongoDB'ga ulanish
├── schemas/                ← Bazadagi jadvallar (kolleksiyalar) tuzilishi
├── components/             ← Biznes logika (member, property)
└── libs/                   ← Umumiy yordamchi kodlar (enum, dto, type)
```

### 4.1. `app.module.ts` — bosh modul

Bu yerda butun ilova yig'iladi:
1. **ConfigModule** — `.env` faylni o'qiydi, hamma joyda ishlatsa bo'ladi (`isGlobal: true`).
2. **GraphQLModule** — Apollo orqali GraphQL. `autoSchemaFile: true` — sxema koddan avtomatik yaratiladi (code-first).
3. **DatabaseModule** — MongoDB ulanishi.
4. **SchemaModule** — barcha Mongoose modellari.
5. **ComponentsModule** — member va property modullari.

### 4.2. `database.module.ts` — bazaga ulanish

- `NODE_ENV=production` bo'lsa → `MONGO_PROD` manzilga ulanadi.
- Aks holda → `MONGO_DEV` manzilga.

### 4.3. `schemas/` — ma'lumotlar modellari (9 ta)

Har bir fayl MongoDB'dagi bitta kolleksiyani tasvirlaydi:

| Model | Kolleksiya | Nimani saqlaydi |
|---|---|---|
| **Member** | `members` | Foydalanuvchilar (USER / AGENT / ADMIN) |
| **Property** | `properties` | Ko'chmas mulk e'lonlari |
| **BoardArticle** | — | Forum maqolalari |
| **Comment** | — | Izohlar |
| **Follow** | — | Kim kimga obuna bo'lgani |
| **Like** | — | Like'lar |
| **View** | — | Ko'rishlar soni |
| **Notice** | — | Admin e'lonlari / FAQ |
| **Notification** | — | Foydalanuvchi bildirishnomalari |

**Member** asosiy maydonlari:
- `memberType` — USER, AGENT yoki ADMIN
- `memberStatus` — ACTIVE, BLOCK, DELETE
- `memberAuthType` — PHONE, EMAIL, TELEGRAM
- `memberPhone`, `memberNick` — **unikal** (takrorlanmaydi)
- `memberPassword` — `select: false` (so'rovda avtomatik qaytmaydi — xavfsizlik uchun)
- Hisoblagichlar: `memberProperties`, `memberFollowers`, `memberLikes`, `memberPoints`, `memberRank` va h.k.

**Property** asosiy maydonlari:
- `propertyType`, `propertyLocation`, `propertyStatus` — enum qiymatlar
- `propertyTitle`, `propertyPrice`, `propertySquare`, `propertyBeds`, `propertyRooms`
- `propertyImages` — rasmlar ro'yxati
- `propertyBarter`, `propertyRent` — ayirboshlash / ijara mumkinmi
- `memberId` — e'lonni joylagan foydalanuvchiga havola
- `soldAt`, `deletedAt`, `constructedAt` — sanalar
- Unikal indeks: bir xil tur + joy + sarlavha + narxdagi e'lon ikki marta yaratilmaydi.

`schema.module.ts` — barcha 9 ta modelni bir joyda ro'yxatdan o'tkazadi (`'Member'`, `'Property'` ... nomlari bilan), shunda istalgan servisda `@InjectModel('Member')` deb ishlatsa bo'ladi.

### 4.4. `components/` — biznes logika

Har bir komponent 3 qismdan iborat:
- **module** — qismlarni birlashtiradi
- **resolver** — GraphQL so'rovlarini qabul qiladi (REST'dagi controller kabi)
- **service** — asosiy logika, baza bilan ishlaydi

**Member** (hozircha faqat "skelet" — haqiqiy logika yo'q, matn qaytaradi):

| GraphQL | Turi | Hozirgi javob |
|---|---|---|
| `signup` | Mutation | `"signup executed!"` |
| `login` | Mutation | `"login executed!"` |
| `updateMember` | Mutation | `"updateMember executed!"` |
| `getMember` | Query | `"getMember executed!"` |

**Property**:

| GraphQL | Turi | Hozirgi javob |
|---|---|---|
| `getProperty` | Query | `"Property Service is working!"` |

Playground'da sinab ko'rish:
```graphql
mutation { signup }
query { getMember }
```

### 4.5. `libs/` — umumiy yordamchilar

- **enums/** — barcha enum'lar (MemberType, PropertyType, PropertyLocation, ViewGroup ...). `registerEnumType` orqali GraphQL'ga ham tanitilgan.
- **enums/message.enum.ts** — xatolik xabarlari (`WRONG_PASSWORD`, `NOT_AUTHENTICATED`, `BLOCKED_USER` ...). Keyinchalik auth'da ishlatiladi.
- **dto/common.dto.ts** — `PaginationQuery` (`page`, `limit`, `search`) — ro'yxatlarni sahifalab olish uchun.
- **types/common.ts** — `T` — istalgan obyekt uchun umumiy tip.
- **interceptor/logging.interceptor.ts** — har bir so'rov qancha vaqt olganini log qiladi. *Hali ulanmagan.*

---

## 5. Git tarixi bo'yicha bosqichlar

1. Monorepo yaratildi (api + batch).
2. Prettier sozlandi.
3. GraphQL moduli ulandi.
4. Database moduli, `.env` asosida ulanish.
5. GraphQL enum'lari qo'shildi.
6. 9 ta Mongoose sxema yozildi.
7. Modellar `SchemaModule`ga markazlashtirildi.
8. Keraksiz `AppService` / `AppResolver` olib tashlandi, testlar tozalandi.
9. Member komponentiga `signup`, `login`, `updateMember` mutatsiyalari qo'shildi.

---

## 6. E'tibor berish kerak bo'lgan joylar ⚠️

1. **Maxfiy ma'lumot ochiq turibdi.** `.env.example` faylida haqiqiy MongoDB login/paroli bor va bu fayl git'ga yuklanadi. Parolni Atlas'da almashtirib, `.env.example`ga namuna qiymat (`mongodb+srv://USER:PASSWORD@...`) qo'yish kerak.
2. **Modellar ikki marta ro'yxatdan o'tgan.** `MemberModule` va `PropertyModule` o'zlari ham `MongooseModule.forFeature` chaqiradi, holbuki `SchemaModule` buni allaqachon qiladi. Bittasini qoldirish kerak.
3. **Like modeli `ViewGroup` enum'ini ishlatadi**, `like.enum.ts` mavjud bo'lsa ham. Ehtimol nusxa ko'chirishda qolib ketgan.
4. **Batch app** hali eski uslubda (`AppService`, 2 probel bilan). API app esa tozalangan va tab ishlatadi.

---

## 7. Keyingi qadamlar (taxminiy)

- [ ] Member uchun DTO'lar (`MemberInput`, `LoginInput`, `Member` output tipi)
- [ ] `signup` / `login` — haqiqiy logika: bcrypt bilan parol hash, JWT token
- [ ] Auth guard va rollar (USER / AGENT / ADMIN)
- [ ] `LoggingInterceptor`ni ulash, global `ValidationPipe`
- [ ] Property CRUD (yaratish, ro'yxat, filter, pagination)
- [ ] Qolgan komponentlar: like, view, follow, comment, board-article, notice, notification
- [ ] Rasm yuklash (`graphql-upload`)
- [ ] Batch serverda rejali vazifalar (reyting hisoblash)
