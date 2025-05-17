# Finance API

This is a NestJS-based REST API for the Finance application, converted from CodeIgniter 4.

## Features

- Authentication with JWT
- Role-based access control
- CRUD operations for all entities
- Pagination, filtering, and sorting
- Swagger documentation

## Description

This project is a rewrite of a CodeIgniter 4 backend to NestJS, maintaining the same file/model names and database structure. It provides a RESTful API for a finance management system.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env` file:

```
# Environment
NODE_ENV=development

# Application
PORT=3000
API_PREFIX=api

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=qweasd123
DB_DATABASE=finance_pesat

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600s
```

4. Start the application:

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

The API documentation is available at `/docs` when the application is running.

## Modules

The application is organized into the following modules:

- **Auth**: Authentication and authorization
- **Common**: Shared utilities and services
- **RefUangKeluar**: Reference for expense categories
- **RefUangMasuk**: Reference for income categories
- **RefSiswa**: Student management
- **TransSiswa**: Student transactions

## Database Structure

The application uses MySQL as the database. The main tables are:

- `adm_user`: User accounts
- `adm_roles`: User roles
- `ref_uang_keluar`: Expense categories
- `ref_uang_masuk`: Income categories
- `ref_siswa`: Student records
- `trans_siswa`: Student transactions

## License

This project is licensed under the MIT License.
