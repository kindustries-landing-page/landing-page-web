# Task: Klotus landing-page web warranty API integration

## Request Input
- Type: FEATURE
- Mục tiêu: Import source landing page user-facing do anh cung cấp, gắn vào repo `landing-page-web`, tích hợp API bảo hành Klotus để check/activate theo QR query `sokhung` + `somay`.
- Bối cảnh/ngữ cảnh: Phase 1 chỉ ưu tiên landing page end-user. API NestJS `landing-page-api` đã có public endpoints check/activate. Cần xử lý cả case khách quẹt QR lần nữa thì hiển thị đã kích hoạt.

## Goal
Landing page Klotus chạy được ở repo `landing-page-web`, trang `/bao-hanh` gọi API thật thay cho localStorage/mock logic.

## Scope
- In-scope:
  - import source zip vào `landing-page-web`
  - thêm env `VITE_API_BASE_URL`
  - wiring `GET /api/v1/public/warranty/check`
  - wiring `POST /api/v1/public/warranty/activate`
  - UI modal cho 3 trạng thái: checking / confirm activate / already activated / activate success / error
  - build + test/lint liên quan
- Out-of-scope:
  - dashboard web
  - deploy Head/NPM
  - full content redesign ngoài flow warranty

## Gate 0 — DB/API Precheck
- DB collections/fields liên quan:
  - `klotus_vehicle_registry(frame_no, engine_no, warranty_status)`
  - `klotus_warranty_activations(activated_date, activated_at, status)`
  - `klotus_activation_logs`
- API contract liên quan:
  - `GET /api/v1/public/warranty/check?sokhung=...&somay=...`
  - `POST /api/v1/public/warranty/activate`
- Kết quả: `API_READY`
- Nếu `API_GAP_FOUND`: chặn UI integration

## Checklist
- [x] 1.0 Gate 0 precheck done
- [x] 2.0 Import source into repo
- [x] 3.0 Replace mock/localStorage warranty flow with API flow
- [ ] 4.0 Validate build/test
- [ ] 5.0 Commit + push Gitea

## Evidence
- Source zip path: `/home/lio/.hermes/profiles/pm/cache/documents/doc_48dc4c7457f2_untitled.zip`
- API repo: `/opt/repos/klotus/landing-page-api`
- Build/test evidence: pending
