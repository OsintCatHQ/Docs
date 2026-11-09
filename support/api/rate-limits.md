# Rate limits and error codes

What each answer means and when to retry.

The API accepts up to 3 requests per second per key, unless we agreed a different limit with you.

| Code | What it means | What to do |
| - | - | - |
| 401 or 403 | The key is missing, wrong, expired or revoked. | Check the `x-api-key` header, or create a new key. |
| 403 | Your plan doesn't include the API or this module, the key lacks a permission, the request came from an IP address you didn't allow, or the account is frozen. | The `error` field in the answer says which. Check your plan, the key's permissions and your allowed IP addresses. |
| 429 | Too many requests per second, or your plan's lookups are used up. | Wait and retry, or move to a bigger plan on [Pricing](https://www.osintcat.net/pricing). |
| 5xx | Something went wrong on our side. | Retry after a short wait. These calls are not charged when they find nothing. |

---

Source: https://support.osintcat.net/articles/rate-limits (updated 2026-11-07)
