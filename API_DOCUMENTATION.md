# DERTOUR Motion Klub - API Dokumentace

## Přehled projektu

Aplikace pro správu aktivit v hotelech DERTOUR Motion Klub. Obsahuje dvě hlavní role:
- **Host (Guest)** - turisté v hotelu, kteří si rezervují aktivity
- **Animátor (Animator)** - zaměstnanci, kteří spravují registrace a aktivity

---

## Datové typy

### Participant (Účastník)
```typescript
{
  id: string;              // Unikátní ID účastníka
  type: 'Adult' | 'Child' | 'Infant';  // Typ účastníka
  display_name: string;    // Zobrazované jméno
  age: number;            // Věk účastníka
}
```

### Activity (Aktivita)
```typescript
{
  activity_id: number;           // ID aktivity
  title: string;                 // Název aktivity
  short_description: string;     // Krátký popis
  long_description?: string;     // Dlouhý popis (volitelné)
  category: string;              // Kategorie (Sport, Relaxace, atd.)
  images?: Array<{ url: string }>;  // Obrázky aktivity
  location: {
    label: string;               // Název místa konání
  };
  events: ActivityEvent[];       // Seznam událostí/termínů
}
```

### ActivityEvent (Událost aktivity)
```typescript
{
  event_id: number;        // ID události/termínu
  start_at: string;        // Čas začátku (ISO 8601)
  end_at: string;          // Čas konce (ISO 8601)
  capacity: {
    max: number;           // Maximální kapacita
    confirmed: number;     // Potvrzené rezervace
    available: number;     // Dostupná místa
  };
  age_profile: {
    min: number;           // Minimální věk
    max: number;           // Maximální věk
  };
}
```

### Hotel
```typescript
{
  hotel_id: string;        // ID hotelu
  name: string;            // Název hotelu
  provider_id?: number;    // ID poskytovatele (volitelné)
}
```

### Booking (Rezervace)
```typescript
{
  booking_id: number;      // ID rezervace
  participant: Participant; // Účastník rezervace
}
```

---

## API Endpointy

### 1. `getProgram(dateFrom, dateTo, hotelId)`

**Účel:** Získání programu aktivit pro zadané období a hotel

**Request:**
- `dateFrom: string` - Datum začátku (YYYY-MM-DD)
- `dateTo: string` - Datum konce (YYYY-MM-DD)
- `hotelId: string` - ID hotelu

**Response:**
```typescript
{
  range: {
    date_from: string;
    date_to: string;
  };
  hotel: Hotel;
  activities: Activity[];
}
```

**Použito na stránkách:**
- `/program` (ProgramPage) - načtení aktivit pro pobyt hosta

---

### 2. `bookActivity(booking)`

**Účel:** Vytvoření nové rezervace aktivity

**Request:**
```typescript
{
  BNR: string;              // Číslo rezervace hosta
  event_id: number;         // ID události/termínu
  participants: Participant[]; // Seznam účastníků
}
```

**Response:**
```typescript
{
  status: 'success' | 'error';
}
```

**Použito na stránkách:**
- `/program` (ProgramPage) - rezervace aktivity hostem
- `/animator/add` (AnimatorAddRegistration) - manuální přidání registrace animátorem

---

### 3. `getUserBookings(bnr)`

**Účel:** Získání všech rezervací pro daného hosta

**Request:**
- `bnr: string` - Číslo rezervace hosta (BNR)

**Response:**
```typescript
{
  bnr: string;
  hotel: Hotel;
  activities: BookedActivity[];  // Zarezervované aktivity
}
```

**BookedActivity struktura:**
```typescript
{
  event_id: number;
  title: string;
  start_at: string;
  end_at: string;
  location: { label: string };
  bookings: Booking[];  // Seznam rezervací pro tuto aktivitu
}
```

**Použito na stránkách:**
- `/my-activities` (MyActivitiesPage) - zobrazení rezervací hosta

---

### 4. `cancelBooking(bookingId, bnr, eventId, participant)`

**Účel:** Zrušení existující rezervace

**Request:**
- `bookingId: number` - ID rezervace ke zrušení
- `bnr: string` - Číslo rezervace hosta
- `eventId: number` - ID události
- `participant: Participant` - Účastník, kterému se ruší rezervace

**Response:**
```typescript
{
  status: 'success' | 'error';
}
```

**Použito na stránkách:**
- `/my-activities` (MyActivitiesPage) - zrušení rezervace hostem
- `/animator/remove` (AnimatorRemoveRegistration) - zrušení registrace animátorem

---

### 5. `getAnimatorRegistrations(dateFrom, dateTo, activityId?)`

**Účel:** Získání přehledu registrací pro animátory

**Request:**
- `dateFrom: string` - Datum začátku (YYYY-MM-DD)
- `dateTo: string` - Datum konce (YYYY-MM-DD)
- `activityId?: string` - Volitelný filtr pro konkrétní aktivitu

**Response:**
```typescript
Array<{
  registration_id: number;
  event_id: number;
  activity_title: string;
  participant_name: string;
  bnr: string;
  start_at: string;
  end_at: string;
  location: string;
  status: 'confirmed' | 'cancelled';
}>
```

**Použito na stránkách:**
- `/animator/registrations` (AnimatorRegistrations) - přehled všech registrací

---

## Mapování stránek a API volání

### Guest (Host) stránky

#### 1. `/login` - GuestLogin
**API volání:** Žádná
**Formulářová pole:**
- `bnr` (string) - Číslo rezervace
- `email` (string) - Email hosta
- `adult_count` (number, optional) - Počet dospělých

**Ukládá se do localStorage:**
```typescript
{
  bnr: string;
  email: string;
  hotel: Hotel;
  stay_period: {
    date_from: string;
    date_to: string;
  };
  participants: Participant[];
}
```

---

#### 2. `/program` - ProgramPage
**API volání:**
- `getProgram(dateFrom, dateTo, hotelId)` - při načtení stránky
- `bookActivity(booking)` - při potvrzení rezervace

**Zobrazovaná data:**
- Seznam aktivit s informacemi:
  - `title` - název aktivity
  - `short_description` - popis
  - `category` - kategorie
  - `location.label` - místo konání
  - `events[].start_at` - čas začátku
  - `events[].end_at` - čas konce
  - `events[].capacity` - informace o kapacitě

**Interakce:**
- Vyhledávání aktivit podle názvu
- Filtrování podle kategorie
- Výběr účastníků pro rezervaci
- Potvrzení rezervace

---

#### 3. `/my-activities` - MyActivitiesPage
**API volání:**
- `getUserBookings(bnr)` - při načtení stránky
- `cancelBooking(bookingId, bnr, eventId, participant)` - při zrušení rezervace

**Zobrazovaná data:**
- Seznam zarezervovaných aktivit:
  - `title` - název aktivity
  - `start_at` - čas začátku
  - `end_at` - čas konce
  - `location.label` - místo konání
  - `bookings[].participant` - účastníci

**Interakce:**
- Zobrazení detailu rezervace
- Zrušení rezervace pro konkrétního účastníka

---

#### 4. `/profile` - ProfilePage
**API volání:** Žádná

**Zobrazovaná data:**
- Informace z `userSession`:
  - `bnr` - číslo rezervace
  - `email` - email
  - `hotel.name` - název hotelu
  - `stay_period` - období pobytu
  - `participants` - seznam účastníků

---

### Animator (Animátor) stránky

#### 1. `/animator/login` - AnimatorLogin
**API volání:** Žádná

**Formulářová pole:**
- `animatorId` (string) - ID animátora
- `password` (string) - Heslo

**Ukládá se do localStorage:**
```typescript
{
  animator_id: string;
  hotel: Hotel;
  role: 'animator';
}
```

---

#### 2. `/animator/dashboard` - AnimatorDashboard
**API volání:** Žádná (mock data)

**Zobrazovaná data:**
- Statistiky:
  - Celkový počet registrací
  - Aktivní aktivity
  - Dnešní aktivity
  - Průměrná obsazenost
- Poslední aktivity
- Dnešní rozvrh

**Navigace:**
- Rychlé akce (odkazy na další stránky)

---

#### 3. `/animator/registrations` - AnimatorRegistrations
**API volání:**
- `getAnimatorRegistrations(dateFrom, dateTo, activityId)` - při načtení nebo změně filtrů

**Formulářová pole (filtry):**
- `dateFrom` (string) - Datum od
- `dateTo` (string) - Datum do
- `selectedActivity` (string) - Filtr podle aktivity
- `searchTerm` (string) - Vyhledávání v textu

**Zobrazovaná data:**
- Seznam registrací s informacemi:
  - `participant_name` - jméno účastníka
  - `bnr` - číslo rezervace
  - `activity_title` - název aktivity
  - `start_at` - datum a čas
  - `location` - místo konání
  - `status` - stav registrace

---

#### 4. `/animator/add` - AnimatorAddRegistration
**API volání:**
- `bookActivity(booking)` - při přidání registrace

**Formulářová pole:**
- `bnr` (string) - Číslo rezervace hosta
- `eventId` (number) - ID události/termínu
- `participants` (Participant[]) - Vybraní účastníci

**Proces:**
1. Vyhledání hosta podle BNR
2. Výběr aktivity a termínu
3. Výběr účastníků
4. Potvrzení registrace

---

#### 5. `/animator/remove` - AnimatorRemoveRegistration
**API volání:**
- `cancelBooking(bookingId, bnr, eventId, participant)` - při zrušení registrace

**Formulářová pole:**
- `bnr` (string) - Číslo rezervace hosta
- Výběr rezervace ke zrušení

**Proces:**
1. Vyhledání hosta podle BNR
2. Zobrazení aktivních rezervací
3. Výběr rezervace ke zrušení
4. Potvrzení zrušení

---

#### 6. `/animator/profile` - AnimatorProfile
**API volání:** Žádná (mock data)

**Zobrazovaná data:**
- Osobní informace:
  - Jméno, příjmení
  - Přezdívka
  - Telefon, email
- Bio
- Pracovní informace:
  - Pozice
  - Hotel
  - Datum nástupu
  - ID animátora
- Jazyky
- Specializace

---

## Autentizace a session management

### Guest Session
**Uloženo v:** `localStorage` pod klíčem `motionUserSession`

```typescript
{
  bnr: string;
  email: string;
  hotel: Hotel;
  stay_period: {
    date_from: string;
    date_to: string;
  };
  participants: Participant[];
}
```

### Animator Session
**Uloženo v:** `localStorage` pod klíčem `motionAnimatorSession`

```typescript
{
  animator_id: string;
  hotel: Hotel;
  role: 'animator';
}
```

---

## Poznámky k implementaci

### Současný stav
- Aplikace používá **mock API** (`src/services/motionApi.ts`)
- Data jsou simulována v paměti prohlížeče
- Žádné skutečné HTTP požadavky na backend

### Pro napojení na reálný backend
Je třeba upravit soubor `src/services/motionApi.ts` a nahradit mock funkce skutečnými HTTP voláními:

```typescript
// Příklad pro getProgram:
export const getProgram = async (
  dateFrom: string, 
  dateTo: string, 
  hotelId: string
): Promise<ProgramResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/program?dateFrom=${dateFrom}&dateTo=${dateTo}&hotelId=${hotelId}`
  );
  return response.json();
};
```

### Doporučení
1. Zachovat strukturu typů v `src/types/motion.ts`
2. Zachovat interface API funkcí v `src/services/motionApi.ts`
3. Pouze nahradit implementaci mock funkcí za skutečná HTTP volání
4. Přidat error handling a loading states
5. Implementovat refresh token mechanismus pro autentizaci
