## Request Input (bạn chỉ cần điền phần này)
- Type: ENHANCE
- Mục tiêu: Tạo Gitea Actions cho branch master để deploy landing-page-web lên Head.
- Bối cảnh/ngữ cảnh: Tham khảo workflow ERP hiện có, deploy stack `/opt/stacks/klotus-landing-page-web`.

## Goal
Tự động deploy Web khi push vào `master` của repo `landing-page-web`.

## Scope
- In-scope:
  - `.gitea/workflows/deploy-master.yml`
  - health check web sau deploy
- Out-of-scope:
  - đổi logic ứng dụng
  - đổi API/Directus schema

## Relevant Files
- `.gitea/workflows/deploy-master.yml` - workflow deploy production Head

## Gate 0 — DB Precheck (bắt buộc)
- Collections/fields liên quan: N/A (infra-only)
- Data nền cần có: stack Head hoạt động sẵn
- Constraint/index/default cần có: SSH secret `DEPLOY_KEY` tồn tại trên Gitea repo
- Kết quả: `DB_READY`
- Nếu `DB_GAP_FOUND`: N/A

## Coordination Impact
- [ ] Directus staging schema affected
- [ ] ERP Web contract affected
- [x] No cross-system impact

## Checklist (cập nhật realtime)
- [x] 1.0 Gate 0 DB Precheck done
- [ ] 2.0 Backend workflow/API gate done
- [ ] 3.0 UI handoff gate done
- [ ] 4.0 Validate
  - [ ] 4.1 Workflow syntax reviewed
  - [ ] 4.2 Smoke logic reviewed
- [ ] 5.0 Close
  - [ ] 5.1 Lessons learned entry (if issue)
  - [ ] 5.2 Commit + push code (web/api)
  - [ ] 5.3 Summary with evidence

## Validation Evidence
- DB precheck result: DB_READY
- Build:
- Smoke:

## Lessons Learned
- Link: No issue

## Commit/Push Status
- API repo: N/A
- Web repo:
- DB/directus staging: N/A

<!-- ci smoke 20260527T154151Z -->
