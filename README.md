# Klotus Landing Page Web

Frontend landing page cho Klotus warranty/public funnel.

## Production target

- host: `Head-Liouni`
- domain: `klotus.liouni.com`
- API: `api.klotus.vn`

## Phase 1 scope

- route `/bao-hanh`
- query QR: `sokhung`, `somay`
- call API:
  - `GET /api/v1/public/warranty/check`
  - `POST /api/v1/public/warranty/activate`

## Local run

```bash
npm install
npm run dev
```
