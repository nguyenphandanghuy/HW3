# AI Failure Audit Report - HW3

## Bug 1: Naive `setInterval` Timer Lag in Background Tabs
* **Issue:** Naive `setInterval` lags behind when browser tabs are inactive due to browser throttling.
* **Fix:** Converted timer calculation to `Math.max(0, targetEpochMs - Date.now())` combined with `visibilitychange` event listener in `usePubgAirdropTimer.ts`.

## Bug 2: Missing Optimistic State Rollback on 409 Conflict
* **Issue:** Failed API claims left local inventory decremented without server confirmation.
* **Fix:** Wrapped claim API call in `try/catch` block to increment stock back (+1) whenever a 409 HTTP status is caught.

## Bug 3: Duplicate Click Race Condition
* **Issue:** Rapid double clicks caused multiple simultaneous requests and double stock deduction.
* **Fix:** Introduced an in-flight loading lock state (`loadingIds`) to immediately disable the CTA button during asynchronous processing.