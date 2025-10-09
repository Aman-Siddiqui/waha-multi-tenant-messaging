# 💬 WAHA Multi-Tenant Messaging API
> **NestJS + PostgreSQL + WAHA (WhatsApp HTTP API)**  
A multi-tenant messaging backend with JWT auth, RBAC roles, and webhook integration.

---

## 🧭 Overview
This project provides a **multi-tenant WhatsApp messaging API** using:
- ✅ **NestJS** – Modular architecture  
- ✅ **TypeORM + PostgreSQL** – Reliable persistence  
- ✅ **JWT Authentication** – Secure login + refresh  
- ✅ **RBAC** – Role-based access control (Admin, Agent, Manager)  
- ✅ **WAHA Integration** – Send/receive WhatsApp messages  
- ✅ **Swagger Docs** – Full API documentation  

---

## 🖼️ Project Architecture

```
src/
 ┣ auth/         # JWT, guards, login, refresh
 ┣ tenants/      # Tenant entities & middleware
 ┣ users/        # User model + RBAC roles
 ┣ waha/         # WhatsApp HTTP API integration
 ┣ messages/     # Send & receive message APIs
 ┣ webhooks/     # WAHA inbound message listener
 ┣ health/       # /health & /ready endpoints
 ┣ common/       # Middleware, filters, decorators
 ┗ tests/        # Jest + Supertest integration tests
```

---

## ⚙️ 1. Prerequisites
Make sure you have:
- **Node.js** ≥ 18  
- **npm** ≥ 9  
- **PostgreSQL** ≥ 13  
- (Optional) **Docker Desktop**

---

## 🧩 2. Installation
Clone and install:
```bash
git clone https://github.com/<your-username>/waha-multi-tenant-messaging.git
cd waha-multi-tenant-messaging
npm install
```

---

## ⚙️ 3. Environment Setup
Create a `.env` file in the root:

```env
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=waha

# JWT
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=refreshsecret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# WAHA Integration
WAHA_BASE=http://localhost:9999
WAHA_API_KEY=testkey
WAHA_WEBHOOK_SECRET=testwebhook

# Server
PORT=3000
```

---

## 🧱 4. Run Database Migrations
```bash
npm run typeorm -- migration:run -d ormconfig.ts
```

---

## 🌱 5. Seed Demo Data
```bash
npm run seed
```

**Demo User:**
```
Email: admin@demo.com
Password: ChangeMe123!
Role: TENANT_ADMIN
```

---

## 🚀 6. Start the Application
Development mode:
```bash
npm run start:dev
```

Server runs on → [http://localhost:3000/api](http://localhost:3000/api)

Swagger Docs → [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🔑 7. Authentication
Login to get tokens:
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "ChangeMe123!"
}
```

Response:
```json
{
  "access_token": "<JWT>",
  "refresh_token": "<JWT>"
}
```

---

## 💬 8. Send WhatsApp Message
```bash
POST http://localhost:3000/api/messages/send
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phone": "919999999999",
  "text": "Hello from WAHA!"
}
```

---

## 🌐 9. Webhook for Inbound Messages
```bash
POST http://localhost:3000/webhooks/waha
x-waha-webhook-token: testwebhook
Content-Type: application/json

{
  "session": "default",
  "data": { "from": "919999999999", "body": "Hello!" }
}
```

---

## 🧪 10. Run Tests
```bash
npm test
```

Includes:
- ✅ Login success  
- ✅ Tenant isolation  
- ✅ RBAC denial  
- ✅ WAHA mock  
- ✅ Message send happy path  

---

## 🐳 11. Docker Setup (Optional)
Run full stack (DB + WAHA + API):
```bash
docker-compose up -d --build
```

Then access:
- API → [http://localhost:3000/api](http://localhost:3000/api)  
- WAHA → [http://localhost:9999](http://localhost:9999)  

---

## 📦 Useful Commands

| Purpose | Command |
|----------|----------|
| Install dependencies | `npm install` |
| Run migrations | `npm run typeorm -- migration:run -d ormconfig.ts` |
| Seed demo user | `npm run seed` |
| Start app | `npm run start:dev` |
| Run tests | `npm test` |
| Build for prod | `npm run build` |
| Start via Docker | `docker-compose up -d --build` |

---

## 📘 API Summary

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/auth/login` | POST | Login with credentials |
| `/api/auth/refresh` | POST | Refresh JWT tokens |
| `/api/tenants` | POST | Create tenant (admin only) |
| `/api/users/me` | GET | Get logged-in user info |
| `/api/messages/send` | POST | Send WhatsApp message |
| `/webhooks/waha` | POST | Receive WAHA inbound webhook |
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |

---

## 🧠 Credits
Built with ❤️ using:
- [NestJS](https://nestjs.com/)  
- [TypeORM](https://typeorm.io/)  
- [PostgreSQL](https://www.postgresql.org/)  
- [WAHA API](https://github.com/devlikeapro/whatsapp-http-api)  

---

## 🏁 License
MIT License © 2025 — Developed by **Aman Siddiqui**
