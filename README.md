# 📚 Personal Book Manager - Backend API

A thoughtfully crafted backend API for managing your personal book collection. Built with Node.js, Express, and MongoDB, this API provides authentication, book management, and insightful analytics for readers.

## ✨ Features

### 🔐 Authentication
- **Secure JWT-based authentication**
- User registration and login
- Protected routes and user data
- Password hashing with bcrypt

### 📖 Book Management
- **Create, Read, Update, Delete** books
- Track reading status: *Want to Read*, *Reading*, *Completed*
- Organize with custom tags
- Add personal notes to each book
- Filter books by status, tags, or search terms
- Pagination support for large collections

### 📊 Dashboard & Analytics
- Total book count
- Books grouped by reading status
- Most used tags
- Top authors in your collection
- Recent additions

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing
- **Validation:** express-validator

## 📁 Project Structure

```
book-manager-backend/
├── config/
│   └── database.config.js      # Database connection config
├── controllers/                # HTTP request/response handlers
│   ├── auth.controller.js      # Auth HTTP handlers
│   └── book.controller.js      # Book HTTP handlers
├── middleware/                 # Express middleware
│   ├── auth.middleware.js      # JWT authentication
│   ├── error.middleware.js     # Error handling
│   ├── validation.middleware.js # Input validation
│   └── requestLogger.middleware.js # Request logging
├── models/                     # Mongoose schemas
│   ├── User.model.js           # User schema
│   └── Book.model.js           # Book schema
├── routes/                     # API routes
│   ├── auth.routes.js          # Auth endpoints
│   └── book.routes.js          # Book endpoints
├── services/                   # Business logic layer
│   ├── auth.service.js         # Authentication logic
│   └── book.service.js         # Book management logic
├── utils/                      # Utility functions
│   ├── constants.js            # Application constants
│   └── validator.js            # Validation helpers
├── .gitignore
├── ARCHITECTURE.md             # Architecture documentation
├── API_DOCUMENTATION.md        # Complete API reference
├── env.example                 # Environment variables template
├── package.json
├── README.md
└── server.js                   # Application entry point
```

## 🏗️ Architecture

This backend follows a **clean layered architecture** with clear separation of concerns:

```
Routes → Middleware → Controllers → Services → Models → Database
```

- **Routes**: Define API endpoints
- **Middleware**: Handle authentication, validation, errors
- **Controllers**: Handle HTTP request/response
- **Services**: Contain all business logic
- **Models**: Define data schemas and database operations

👉 See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd thumbstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/book-manager
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas connection string in your `.env` file.

5. **Run the application**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Book Routes (`/api/books`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/books` | Get all books (with filters) | Private |
| GET | `/api/books/:id` | Get single book | Private |
| POST | `/api/books` | Create new book | Private |
| PUT | `/api/books/:id` | Update book | Private |
| DELETE | `/api/books/:id` | Delete book | Private |
| GET | `/api/books/dashboard/stats` | Get dashboard statistics | Private |
| GET | `/api/books/tags` | Get all tags | Private |

👉 See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference with examples.

## 📝 API Usage Examples

### 1. Register a New User

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Add a Book

```bash
POST /api/books
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "tags": ["classic", "fiction"],
  "status": "want-to-read",
  "notes": "Recommended by a friend"
}
```

### 4. Get All Books with Filters

```bash
# Get all books
GET /api/books
Authorization: Bearer <your-jwt-token>

# Filter by status
GET /api/books?status=reading
Authorization: Bearer <your-jwt-token>

# Filter by tag
GET /api/books?tag=fiction
Authorization: Bearer <your-jwt-token>

# Search
GET /api/books?search=gatsby
Authorization: Bearer <your-jwt-token>

# Pagination
GET /api/books?page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

### 5. Update Book Status

```bash
PUT /api/books/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "status": "completed"
}
```

### 6. Get Dashboard Statistics

```bash
GET /api/books/dashboard/stats
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 42,
    "statusCounts": {
      "wantToRead": 15,
      "reading": 5,
      "completed": 22
    },
    "tags": [
      { "name": "fiction", "count": 18 },
      { "name": "classic", "count": 12 }
    ],
    "recentBooks": [...],
    "topAuthors": [
      { "name": "F. Scott Fitzgerald", "count": 3 }
    ]
  }
}
```

### 7. Delete a Book

```bash
DELETE /api/books/:id
Authorization: Bearer <your-jwt-token>
```

## 🔒 Authentication

All book-related endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned when you sign up or log in.

## 📊 Book Status Values

When creating or updating books, use these status values:

- `want-to-read` - Books you plan to read
- `reading` - Currently reading
- `completed` - Finished books

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🚢 Deployment

### Deploy to Heroku

1. Create a Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set NODE_ENV=production
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Get your connection string and update `MONGODB_URI`

## 🧪 Testing

You can test the API using:

- **Postman**: Import the endpoints and test manually
- **Thunder Client**: VS Code extension for API testing
- **cURL**: Command-line testing

Example with cURL:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📋 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## 🔧 Development

### Install Nodemon for auto-restart

```bash
npm install -D nodemon
```

### Run in development mode

```bash
npm run dev
```

## 🤝 Contributing

This is a technical challenge project. Feel free to fork and enhance it with:

- Additional book metadata (ISBN, cover images, publication year)
- Reading goals and progress tracking
- Book recommendations
- Social features (share favorite books)
- Import/export functionality

## 📄 License

ISC

## 👤 Author

Built with care for Thumbstack technical challenge.

---

**Happy Reading! 📚**

For questions or issues, please open an issue in the repository.

#   T h u m b S t a c k - T e c h n o l o g i e s  
 