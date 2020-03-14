---
"oas3-chow-chow": major
---

💥 Breaking Changes:
`validateRequest` will now be deprecated in favor of `validateRequestByPath`, but it will NOT break. Instead, it will be printing a deprecated warning message, but do expect it to be removed completely in the future.

🎁 New Features:
Adds support for validate by operationId
