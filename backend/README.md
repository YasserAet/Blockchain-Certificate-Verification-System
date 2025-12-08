# Backend API - Blockchain Certificate Verification System

REST API backend for the BCVS platform built with Express.js, TypeScript, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev
```

The API will be available at `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # PostgreSQL connection
│   │   ├── blockchain.ts # Ethers.js setup
│   │   └── schema.sql   # Database schema
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── certificate.controller.ts
│   │   ├── user.controller.ts
│   │   └── admin.controller.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── certificate.routes.ts
│   │   ├── user.routes.ts
│   │   └── admin.routes.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   └── errorHandler.ts
│   ├── models/          # TypeScript types
│   ├── services/        # Business logic
│   ├── utils/           # Utilities
│   │   ├── jwt.ts
│   │   └── validators.ts
│   └── index.ts         # App entry point
├── Dockerfile           # Docker configuration
├── .dockerignore
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Certificates
- `POST /api/certificates/upload` - Upload certificate (institution only)
- `GET /api/certificates` - Get all certificates (filtered by role)
- `GET /api/certificates/:id` - Get certificate by ID
- `POST /api/certificates/verify/:id` - Verify certificate

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Admin
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**Request Header:**
```
Authorization: Bearer <token>
```

**Token Payload:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "student"
}
```

## 🗄️ Database Schema

### Users Table
```sql
id, name, email, password, role, institution, created_at, updated_at
```

### Certificates Table
```sql
id, student_id, institution_id, title, description, issue_date, 
expiry_date, status, blockchain_tx_hash, ipfs_hash, created_at, updated_at
```

### Blockchain Transactions Table
```sql
id, certificate_id, tx_hash, operation, status, block_number, created_at
```

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bcvs
DATABASE_USER=bcvs_user
DATABASE_PASSWORD=bcvs_password_2024
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
BLOCKCHAIN_RPC_URL=http://localhost:8545
ML_SERVICE_URL=http://localhost:8000
```

## 🐳 Docker Usage

```bash
# Build and run with docker-compose
docker-compose up backend

# Or build manually
docker build -t bcvs-backend .
docker run -p 3001:3001 bcvs-backend
```

## 📊 Default Users

After running database migrations, these test accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bcvs.com | Admin@123 |
| Institution | mit@university.edu | Admin@123 |
| Student | john@student.com | Admin@123 |

## 🛠️ Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 📝 Example Requests

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Upload Certificate (Institution)
```bash
curl -X POST http://localhost:3001/api/certificates/upload \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "title": "Computer Science Degree",
    "description": "Bachelor of Science in Computer Science",
    "issueDate": "2024-05-15"
  }'
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📦 Dependencies

**Production:**
- express - Web framework
- pg - PostgreSQL client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- ethers - Ethereum interactions
- zod - Schema validation
- cors - CORS middleware
- dotenv - Environment variables

**Development:**
- typescript - Type safety
- ts-node - TypeScript execution
- nodemon - Auto-restart on changes
- @types/* - TypeScript definitions

## 🔗 Related Services

- **Frontend**: Next.js application (port 3000)
- **Database**: PostgreSQL (port 5432)
- **Blockchain**: Hardhat node (port 8545)
- **ML Service**: FastAPI (port 8000)

## 📄 License

MIT
