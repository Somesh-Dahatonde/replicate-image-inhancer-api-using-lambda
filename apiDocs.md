# API Documentation

Welcome to the API documentation for [Your API Name].

## Introduction

Provide a brief introduction to your API, explaining its purpose and what developers can achieve using it.

## Localhost URL

- **Localhost URL**: `https://localhost:4000/`

#### 1. `LOGIN`

- **Endpoint URL**: `/login`
- **HTTP Method**: POST
- **Request Body**:

  ```json
  data: {
    "username": "admin",
    "password": "admin"
  }
  ```

- **Response**:
  ```json
  data: {
    "statusCode": 200,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjYsIm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoidGVzdC5hZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2OTQ2MzA0ODF9.5mSjFzk-HhN_O2gOIwBcTNVFGGaMAVtKkpgVb61RAPk",
    "user": {
        "_id": 6,
        "name": "ADMIN",
        "email": "admin@gmail.com"
    }
  }
  ```

#### 2. `/SIGNUP`

- **Endpoint URL**: `/signup`
- **HTTP Method**: POST
- **Request Body**:

  ```json
  data: {
    "name": "admin",
    "password": "admin",
    "email": "admin@gmail.com",
    "number": "1234567890",
  }
  ```

- **Response**

  ```json
  {
    "statusCode": 200,
    "message": "User Signup successfully"
  }
  ```

<!--

#### Request

```http
GET /endpoint-path
``` -->
