---
name: session-summary
description: Tóm tắt tiến độ, kiểm tra trạng thái và đúc kết kết quả sau mỗi phiên làm việc frontend.
---

# Session Summary Skill

Sử dụng skill này vào cuối mỗi phiên làm việc:

1. **Kiểm tra trạng thái Git**: `git status -s`.
2. **Kiểm tra QC**: `bun run check:ci` và `bun run test`.
3. **Cập nhật Antigravity Brain**: Đảm bảo `walkthrough.md` đã được cập nhật đầy đủ.
