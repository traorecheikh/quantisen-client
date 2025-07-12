
# API Documentation

This document provides the documentation for the API endpoints of the Boisson Management application.

## Base URL

The base URL for all the endpoints is `/api`.

---

## Authentication

### Login

- **Endpoint:** `POST /utilisateurs/login`
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "motDePasse": "password"
  }
  ```
- **Response:**
    - `200 OK`:
      ```json
      {
        "token": "jwt-token",
        "user": {
          "id": 1,
          "nom": "John Doe",
          "email": "user@example.com",
          "role": "ADMIN"
        }
      }
      ```
    - `401 Unauthorized`: If authentication fails.

---

## Boissons

- **Base Path:** `/boissons`

### Add a new boisson

- **Endpoint:** `POST /boissons`
- **Description:** Adds a new boisson to the system.
- **Request Body:** `BoissonDto`
- **Response:**
    - `201 Created`: Returns the created `BoissonDto`.
    - `500 Internal Server Error`: If an error occurs.

### Get all boissons

- **Endpoint:** `GET /boissons`
- **Description:** Retrieves a list of all boissons.
- **Response:**
    - `200 OK`: Returns a list of `BoissonDto`.
    - `500 Internal Server Error`: If an error occurs.

---

## Lots

- **Base Path:** `/lots`

### Get all lots

- **Endpoint:** `GET /lots`
- **Description:** Retrieves a list of all lots.
- **Response:**
    - `200 OK`: Returns a list of `LotDto`.
    - `500 Internal Server Error`: If an error occurs.

### Get all available lots

- **Endpoint:** `GET /lots/disponibles`
- **Description:** Retrieves a list of all available lots, ordered by expiration date.
- **Response:**
    - `200 OK`: Returns a list of `LotDto`.
    - `500 Internal Server Error`: If an error occurs.

---

## Mouvements

- **Base Path:** `/mouvements`

### Record a new movement

- **Endpoint:** `POST /mouvements`
- **Description:** Records a new stock movement.
- **Request Body:** `MouvementDto`
- **Response:**
    - `201 Created`: Returns the created `MouvementDto`.
    - `500 Internal Server Error`: If an error occurs.

### Record multiple movements

- **Endpoint:** `POST /mouvements/batch`
- **Description:** Records multiple stock movements in a single request.
- **Request Body:** `List<MouvementDto>`
- **Response:**
    - `201 Created`: Returns a list of the created `MouvementDto`.
    - `500 Internal Server Error`: If an error occurs.

### Record a return

- **Endpoint:** `POST /mouvements/retour`
- **Description:** Records a return of a product.
- **Query Parameters:**
    - `raison`: The reason for the return.
- **Request Body:** `MouvementDto`
- **Response:**
    - `201 Created`: Returns the created `MouvementDto`.
    - `500 Internal Server Error`: If an error occurs.

### Record an adjustment

- **Endpoint:** `POST /mouvements/ajustement`
- **Description:** Records a stock adjustment.
- **Query Parameters:**
    - `raison`: The reason for the adjustment.
- **Request Body:** `MouvementDto`
- **Response:**
    - `201 Created`: Returns the created `MouvementDto`.
    - `500 Internal Server Error`: If an error occurs.

### Get movements by user

- **Endpoint:** `GET /mouvements/utilisateur/{utilisateurId}`
- **Description:** Retrieves all movements for a specific user.
- **Path Parameters:**
    - `utilisateurId`: The ID of the user.
- **Response:**
    - `200 OK`: Returns a list of `MouvementDto`.
    - `500 Internal Server Error`: If an error occurs.

---

## Statistics

- **Base Path:** `/statistics`

### Get dashboard statistics

- **Endpoint:** `GET /statistics/dashboard`
- **Description:** Retrieves statistics for the dashboard.
- **Response:**
    - `200 OK`: Returns `DashboardStatisticsDto`.

### Get weekly stock movement

- **Endpoint:** `GET /statistics/weekly-stock-movement`
- **Description:** Retrieves the weekly stock movement.
- **Response:**
    - `200 OK`: Returns `WeeklyStockMovementDto`.

---

## Stocks

- **Base Path:** `/stocks`

### Get all stocks

- **Endpoint:** `GET /stocks`
- **Description:** Retrieves a list of all stocks.
- **Response:**
    - `200 OK`: Returns a list of `StockDto`.
    - `500 Internal Server Error`: If an error occurs.

---

## Utilisateurs

- **Base Path:** `/utilisateurs`

### Get all users

- **Endpoint:** `GET /utilisateurs`
- **Description:** Retrieves a list of all users.
- **Response:**
    - `200 OK`: Returns a list of `UtilisateurDto`.
    - `500 Internal Server Error`: If an error occurs.

### Register a new user

- **Endpoint:** `POST /utilisateurs/register`
- **Description:** Registers a new user.
- **Request Body:** `UtilisateurDto`
- **Response:**
    - `201 Created`: Returns the created `UtilisateurDto`.
    - `500 Internal Server Error`: If an error occurs.

### Delete a user

- **Endpoint:** `DELETE /utilisateurs/{id}`
- **Description:** Deletes a user by their ID.
- **Path Parameters:**
    - `id`: The ID of the user to delete.
- **Response:**
    - `204 No Content`: If the user was deleted successfully.
    - `404 Not Found`: If the user was not found.

### Change password

- **Endpoint:** `PATCH /utilisateurs/change-password`
- **Description:** Changes the password for a user.
- **Query Parameters:**
    - `id`: The ID of the user.
- **Request Body:**
  ```json
  {
    "ancienMotDePasse": "old-password",
    "nouveauMotDePasse": "new-password"
  }
  ```
- **Response:**
    - `200 OK`: If the password was changed successfully.
    - `400 Bad Request`: If the request is invalid.
