# Finance API Documentation

This document provides detailed information about the Finance API endpoints.

## Table of Contents

- [Authentication](#authentication)
- [Reference Controllers](#reference-controllers)
- [Transaction Controllers](#transaction-controllers)
- [PPDB Controllers](#ppdb-controllers)
- [Kas Controllers](#kas-controllers)

## Authentication

All API endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "user": {
    "id": "number",
    "username": "string",
    "name": "string",
    "role": "string"
  }
}
```

## Reference Controllers

### RefSiswa

#### Get all students with pagination and filtering

```
GET /ref-siswa
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `name`: Filter by name
- `nisn`: Filter by NISN
- `idTahunAjaran`: Filter by academic year ID
- `isActive`: Filter by active status

**Response:**
```json
{
  "items": [
    {
      "idSiswa": "number",
      "idTahunAjaran": "number",
      "name": "string",
      "nisn": "string",
      "address": "string",
      "phone": "string",
      "isActive": "boolean",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

#### Get a student by ID

```
GET /ref-siswa/{id}
```

**Path Parameters:**
- `id`: Student ID

**Response:**
```json
{
  "idSiswa": "number",
  "idTahunAjaran": "number",
  "name": "string",
  "nisn": "string",
  "address": "string",
  "phone": "string",
  "isActive": "boolean",
  "createdBy": "string",
  "createdDate": "date",
  "modifiedBy": "string",
  "modifiedDate": "date",
  "tahunAjaran": {
    "idTahunAjaran": "number",
    "name": "string"
  }
}
```

#### Create a new student

```
POST /ref-siswa
```

**Request Body:**
```json
{
  "idTahunAjaran": "number",
  "name": "string",
  "nisn": "string",
  "address": "string",
  "phone": "string",
  "isActive": "boolean"
}
```

**Response:**
```json
{
  "idSiswa": "number",
  "idTahunAjaran": "number",
  "name": "string",
  "nisn": "string",
  "address": "string",
  "phone": "string",
  "isActive": "boolean",
  "createdBy": "string",
  "createdDate": "date"
}
```

#### Update a student

```
PATCH /ref-siswa/{id}
```

**Path Parameters:**
- `id`: Student ID

**Request Body:**
```json
{
  "idTahunAjaran": "number",
  "name": "string",
  "nisn": "string",
  "address": "string",
  "phone": "string",
  "isActive": "boolean"
}
```

**Response:**
```json
{
  "idSiswa": "number",
  "idTahunAjaran": "number",
  "name": "string",
  "nisn": "string",
  "address": "string",
  "phone": "string",
  "isActive": "boolean",
  "createdBy": "string",
  "createdDate": "date",
  "modifiedBy": "string",
  "modifiedDate": "date"
}
```

#### Delete a student

```
DELETE /ref-siswa/{id}
```

**Path Parameters:**
- `id`: Student ID

**Response:**
```
204 No Content
```

### RefBiaya

#### Get all fees with pagination and filtering

```
GET /ref-biaya
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `name`: Filter by name
- `isActive`: Filter by active status

**Response:**
```json
{
  "items": [
    {
      "idBiaya": "number",
      "name": "string",
      "description": "string",
      "amount": "number",
      "isActive": "boolean",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date"
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

## Transaction Controllers

### TransSiswa

#### Get all student transactions with pagination and filtering

```
GET /trans-siswa
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaran`: Filter by academic year ID
- `idSiswa`: Filter by student ID
- `idBiaya`: Filter by fee ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idTransSiswa": "number",
      "idTahunAjaran": "number",
      "idSiswa": "number",
      "idBiaya": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      },
      "siswa": {
        "idSiswa": "number",
        "name": "string"
      },
      "biaya": {
        "idBiaya": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

#### Generate a new transaction number

```
GET /trans-siswa/generate-transaction-number
```

**Response:**
```json
{
  "transactionNumber": "string"
}
```

## PPDB Controllers

### PpdbSiswa

#### Get all PPDB students with pagination and filtering

```
GET /ppdb-siswa
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `name`: Filter by name
- `nisn`: Filter by NISN
- `idTahunAjaranPpd`: Filter by PPDB academic year ID
- `isActive`: Filter by active status

**Response:**
```json
{
  "items": [
    {
      "idPpdbSiswa": "number",
      "idTahunAjaranPpd": "number",
      "name": "string",
      "nisn": "string",
      "address": "string",
      "phone": "string",
      "isActive": "boolean",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaranPpd": {
        "idTahunAjaranPpd": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

## Kas Controllers

### KasSiswa

#### Get all student cash transactions with pagination and filtering

```
GET /kas-siswa
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaran`: Filter by academic year ID
- `idSiswa`: Filter by student ID
- `idBiaya`: Filter by fee ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasSiswa": "number",
      "idTahunAjaran": "number",
      "idSiswa": "number",
      "idBiaya": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      },
      "siswa": {
        "idSiswa": "number",
        "name": "string"
      },
      "biaya": {
        "idBiaya": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

### KasSiswaPpdb

#### Get all PPDB student cash transactions with pagination and filtering

```
GET /kas-siswa-ppdb
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaranPpd`: Filter by PPDB academic year ID
- `idPpdbSiswa`: Filter by PPDB student ID
- `idPpdbKomponenBiaya`: Filter by PPDB fee component ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasSiswaPpdb": "number",
      "idTahunAjaranPpd": "number",
      "idPpdbSiswa": "number",
      "idPpdbKomponenBiaya": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaranPpd": {
        "idTahunAjaranPpd": "number",
        "name": "string"
      },
      "ppdbSiswa": {
        "idPpdbSiswa": "number",
        "name": "string"
      },
      "ppdbKomponenBiaya": {
        "idPpdbKomponenBiaya": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

### KasSpp

#### Get all SPP transactions with pagination and filtering

```
GET /kas-spp
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaran`: Filter by academic year ID
- `idSiswa`: Filter by student ID
- `idSppType`: Filter by SPP type ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasSpp": "number",
      "idTahunAjaran": "number",
      "idSiswa": "number",
      "idSppType": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      },
      "siswa": {
        "idSiswa": "number",
        "name": "string"
      },
      "sppType": {
        "idSppType": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

### KasSppPpdb

#### Get all PPDB SPP transactions with pagination and filtering

```
GET /kas-spp-ppdb
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaranPpd`: Filter by PPDB academic year ID
- `idPpdbSiswa`: Filter by PPDB student ID
- `idSppType`: Filter by SPP type ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasSppPpdb": "number",
      "idTahunAjaranPpd": "number",
      "idPpdbSiswa": "number",
      "idSppType": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaranPpd": {
        "idTahunAjaranPpd": "number",
        "name": "string"
      },
      "ppdbSiswa": {
        "idPpdbSiswa": "number",
        "name": "string"
      },
      "sppType": {
        "idSppType": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

### KasUangKeluar

#### Get all cash outflow transactions with pagination and filtering

```
GET /kas-uang-keluar
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaran`: Filter by academic year ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasUangKeluar": "number",
      "idTahunAjaran": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```

### KasUangMasuk

#### Get all cash inflow transactions with pagination and filtering

```
GET /kas-uang-masuk
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `idTahunAjaran`: Filter by academic year ID
- `idListUangMasuk`: Filter by income type ID
- `noTransaksi`: Filter by transaction number
- `tanggalTransaksi`: Filter by transaction date
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "items": [
    {
      "idKasUangMasuk": "number",
      "idTahunAjaran": "number",
      "idListUangMasuk": "number",
      "noTransaksi": "string",
      "tanggalTransaksi": "date",
      "description": "string",
      "amount": "number",
      "createdBy": "string",
      "createdDate": "date",
      "modifiedBy": "string",
      "modifiedDate": "date",
      "tahunAjaran": {
        "idTahunAjaran": "number",
        "name": "string"
      },
      "listUangMasuk": {
        "idListUangMasuk": "number",
        "name": "string"
      }
    }
  ],
  "meta": {
    "totalItems": "number",
    "itemCount": "number",
    "itemsPerPage": "number",
    "totalPages": "number",
    "currentPage": "number"
  }
}
```
