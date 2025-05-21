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

- Node.js (v20 or higher) or Bun (v1.0 or higher)
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
DB_DATABASE=finance_app

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=3600s
```

4. Start the application:

#### Using Node.js

```bash
# Development mode
npm run start:dev
# or use the start script
./start.sh

# Production mode
npm run build
npm run start:prod
```

#### Using Bun (Recommended for better performance)

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Development mode
npm run start:bun
# or
./start-bun.sh

# Production mode
npm run start:bun:prod
```

> **Note**: Using Bun provides better performance and handles file descriptor limits more efficiently, which helps prevent "too many open files" errors.

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
- **RefSpp**: SPP (School Fee) reference
- **TransSpp**: SPP transactions
- **AdmRole**: Role management
- **AdmUser**: User management
- **RefKaryawan**: Employee management
- **RefJabatan**: Position management
- And many more modules for comprehensive school finance management

## Database Structure

The application uses MySQL as the database. The main tables are:

- `adm_user`: User accounts
- `adm_role`: User roles
- `adm_role_assignment`: Role assignments
- `ref_uang_keluar`: Expense categories
- `ref_uang_masuk`: Income categories
- `ref_siswa`: Student records
- `trans_siswa`: Student transactions
- `ref_spp`: SPP references
- `trans_spp`: SPP transactions
- `ref_karyawan`: Employee records
- `ref_jabatan`: Position references

## Troubleshooting

### "Too many open files" Error

If you encounter a "too many open files" error when running with Node.js, try the following:

1. Increase the file descriptor limit:
   ```bash
   ulimit -n 4096
   ```

2. Use the provided start scripts which handle this automatically:
   ```bash
   ./start.sh  # For Node.js
   ./start-bun.sh  # For Bun (recommended)
   ```

3. Switch to Bun for better performance and file handling.

### Missing i18n Directory Error

If you encounter an error related to missing i18n directory:

1. Make sure the i18n directory exists in the dist folder:
   ```bash
   mkdir -p dist/i18n
   cp -r src/i18n/* dist/i18n/
   ```

2. Use the provided start scripts which handle this automatically.

### MD5 Password Authentication

The application supports MD5 password hashing for backward compatibility with legacy systems. When running with Bun, the application uses Node.js crypto module instead of the md5 package for better compatibility.

Password validation works as follows:
1. If the stored password is an MD5 hash (32 characters), the input password is hashed with MD5 and compared
2. If the stored password is a bcrypt hash (starts with $2a$, $2b$, or $2y$), bcrypt.compare is used
3. New passwords are automatically hashed with bcrypt for better security

## License

This project is licensed under the MIT License.
