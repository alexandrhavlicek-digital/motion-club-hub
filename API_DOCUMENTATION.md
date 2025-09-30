# DER TOUR Motion Club – API Documentation (Final)

This document specifies the REST API for the Motion Club prototype, aligned with the Excel draft and business requirements.

---

## Authentication & Scoping

- **Guest (Host)**
  - Login via BNR + booking holder email (+ optional control question like number of adults, plus captcha).
  - After login, scope is **hotel** and **stay period [from, to]** from the BNR.
  - Guest can only view activities in range `[Today → stay.to]` and only for the hotel from the BNR.
  - All further API calls are restricted to that scope.
- **Animator**
  - Login via SSO (JWT token).
  - Scope = hotel from token.
  - Animator can view all dates (past and future) and manually add/cancel bookings without restrictions.
- **Culture / Localization**
  - All program and registrations endpoints accept `culture_code` (e.g. `cs-CZ`).

---

## REST API Endpoints

### 1. Get Program

**GET** `/v1/program`

Request body:

```json
{
  "culture_code": "cs-CZ",
  "date_from": "2025-07-01",
  "date_to": "2025-07-08",
  "hotel": { "hotel_id": "HER90079", "provider_id": 13 }
}
```

Response:

```json
{
  "range": { "date_from": "2025-07-01", "date_to": "2025-07-08" },
  "hotel": { "hotel_id": "HER90079", "name": "Hotel Aurora" },
  "activities": [
    {
      "activity_id": 1001,
      "title": "Paddleboard",
      "short_description": "Lekce na moři",
      "long_description": "Instruktor, vybavení v ceně…",
      "category": "Sport",
      "images": [{ "url": "..." }],
      "location": { "label": "Bar na pláži" },
      "events": [
        {
          "event_id": 1987,
          "start_at": "2025-07-01T10:00:00",
          "end_at": "2025-07-01T12:00:00",
          "capacity": { "max": 30, "confirmed": 24, "available": 6 },
          "age_profile": { "min": 15, "max": 99 }
        }
      ]
    }
  ]
}
```

Notes:
- Guests see only `[Today → stay.to]` filtered data.
- Animators see unrestricted program for their hotel.

---

### 2. Book Activity

**POST** `/v1/activities/book`

Request body:

```json
{
  "booking": {
    "BNR": "191754321",
    "event_id": 1987,
    "participants": [
      { "id": "1", "type": "Adult", "display_name": "Adam N.", "age": 45 },
      { "id": "3", "type": "Adult", "display_name": "Petr S.", "age": 35 }
    ]
  }
}
```

Response:

```json
{
  "booking": { "status": "confirmed" }
}
```

---

### 3. Get User Bookings

**GET** `/v1/user/bookings/{bnr}`

Response:

```json
{
  "bnr": "191754321",
  "hotel": { "hotel_id": "HER90079", "name": "Hotel Aurora" },
  "activities": [
    {
      "event_id": 1987,
      "title": "Paddleboard",
      "start_at": "2025-07-01T10:00:00",
      "end_at": "2025-07-01T12:00:00",
      "location": { "label": "Bar na pláži" },
      "bookings": [
        { "booking_id": 555001, "participant": { "id": 1, "type": "Adult", "display_name": "Adam N.", "age": 45 } },
        { "booking_id": 555010, "participant": { "id": 3, "type": "Adult", "display_name": "Petr S.", "age": 35 } }
      ]
    }
  ]
}
```

---

### 4. Cancel Booking

**POST** `/v1/user/bookings/{booking_id}/cancel`

Request body:

```json
{
  "booking": {
    "BNR": "191754321",
    "event_id": 1987,
    "participant": { "booking_id": 555001, "id": 1, "type": "Adult", "display_name": "Adam N.", "age": 45 }
  }
}
```

Response:

```json
{ "status": "canceled" }
```

---

### 5. Animator Registrations

**GET** `/v1/animator/registrations`

Request body:

```json
{
  "culture_code": "cs-CZ",
  "date_from": "2025-07-01",
  "date_to": "2025-07-01",
  "activity_id": 1001
}
```

Response:

```json
{
  "range": { "from": "2025-07-01", "to": "2025-07-01" },
  "activity": { "activity_id": 1001, "title": "Paddleboard" },
  "registrations": [
    { "booking_id": 555001, "bnr": "191754321", "participant": { "id": 1, "display_name": "Adam N.", "type": "Adult", "age": 45 } },
    { "booking_id": 555010, "bnr": "191754321", "participant": { "id": 3, "display_name": "Petr S.", "type": "Adult", "age": 35 } }
  ]
}
```

---

## Data Models

- **Traveler / Participant**
  - `id` (string)
  - `type` (Adult | Child | Infant)
  - `display_name` (string, minimal PII)
  - `age` (integer)

- **Activity**
  - `activity_id` (number)
  - `title`, `short_description`, `long_description`
  - `category`
  - `images[]`
  - `location.label`
  - `events[]`

- **Event**
  - `event_id`
  - `start_at`, `end_at`
  - `capacity{max, confirmed, available}`
  - `age_profile{min, max}`

- **Booking**
  - `booking_id`
  - `bnr`
  - `event_id`
  - `participant{...}`
  - `status`

- **Hotel**
  - `hotel_id`
  - `provider_id`
  - `name`

---

## Error Handling

- **HTTP Status Codes**
  - 200 OK / 201 Created
  - 400 Bad Request (validation)
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 409 Conflict (e.g. over-capacity)
  - 500 Internal Server Error

- **Error Response Payload**

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Age restriction not met",
  "details": { "field": "age", "expected_min": 15, "given": 9 }
}
```

---

## Frontend Routes (for reference)

These are **UI routes**, not backend API endpoints.

- `/login` – Host login page
- `/program` – Guest program view
- `/my-activities` – Guest bookings
- `/animator/login` – Animator login
- `/animator/registrations` – Animator list of registrations
- `/animator/add` – Animator manual registration
- `/animator/cancel` – Animator manual cancellation

---

## Notes from Business Requirements

- Program for host always limited to `[Today → stay.to]` from BNR.
- Guests see only their hotel; animators see their assigned hotel.
- Minimal participant data (display_name + age).
- Admin/reporting is **out of MVP** (handled via DB).
- QR code is static link (dertouristik.cz).
- Culture/localization via `culture_code`.

---
