# 📡 SprintDesk — API Documentation

This document provides technical documentation for all API integrations, request/response formats, authentication flows, and token refresh mechanisms used in **SprintDesk**.

---

## 🔐 1. Authentication Endpoints (DummyJSON Auth API)

### 1.1 User Login
Authenticates a user and returns an `accessToken` (short-lived) and a `refreshToken` (long-lived).

- **Endpoint**: `POST https://dummyjson.com/auth/login`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 30
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "gender": "female",
    "image": "https://dummyjson.com/icon/emilys/128",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

---

### 1.2 Silent Token Refresh
Generates a fresh `accessToken` using an existing valid `refreshToken`.

- **Endpoint**: `POST https://dummyjson.com/auth/refresh`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "expiresInMins": 30
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```

---

## 🔔 2. Real-Time Notification Polling (JSONPlaceholder API)

Used by TanStack Query v5 to poll for simulated new platform activity every 20 seconds. Polling automatically pauses when the browser tab is hidden using the Page Visibility API (`document.hidden`).

- **Endpoint**: `GET https://jsonplaceholder.typicode.com/posts?_limit=5`
- **Headers**:
  ```http
  Accept: application/json
  ```
- **Response (200 OK)**:
  ```json
  [
    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum..."
    },
    {
      "userId": 1,
      "id": 2,
      "title": "qui est esse",
      "body": "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae..."
    }
  ]
  ```

---

## 🔄 3. Axios Token Interceptor & Silent Refresh Queue

SprintDesk configures custom Axios interceptors in `src/api/interceptors.ts` to handle authentication authorization and token expiration seamlessly.

```
Client Request ──► Attached Bearer Token Header ──► API Execution
                                                        │
                                                 Is Status 401?
                                                  ┌─────┴─────┐
                                                  │ YES       │ NO
                                                  ▼           ▼
                                           Queue Request   Return Result
                                                  │
                                       Call /auth/refresh API
                                                  │
                                            Success?
                                      ┌──────────┴──────────┐
                                      │ YES                 │ NO
                                      ▼                     ▼
                             Update accessToken     Clear Session &
                             & Retry Queue          Redirect to /login
```
