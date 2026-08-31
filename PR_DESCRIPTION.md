# Pull request details

Branch: fix/register-crash

This PR fixes a crash in the registration flow and hardens the frontend token handling and HTTP client refresh logic.

## Changes
- Make RegisterScreen and LoginScreen onAuthenticated callback optional and add safe fallback navigation.
- Improve tokenStorage to gracefully fallback from SecureStore to AsyncStorage when SecureStore isn't available or fails.
- Fix response interceptor logic to correctly resolve and clear pending requests when refresh token rotation succeeds or fails.

## How to test
1. Start backend (docker compose up) and frontend (expo start).
2. Ensure frontend points to backend (API_URL in frontend/src/config/env.ts or expo extras).
3. Register a new user and ensure no crash occurs and navigation proceeds to MainTabs/Home when no callback provided.
4. Test login flow.
5. Simulate expired access token and concurrent 401 responses to validate single refresh and queued requests are resumed.

## Notes
- No backend changes applied.
- If you want additional backend hardening (extra logging or validation), I can prepare a follow-up PR.
