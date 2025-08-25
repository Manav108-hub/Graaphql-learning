# GraphQL Todo App

A full-stack todo application built with GraphQL, Node.js, and SQLite featuring user authentication and CRUD operations.

## Features

- **User Authentication** (Register/Login with JWT)
- **Todo Management** (Create, Read, Update, Delete)
- **User Authorization** (Users can only access their own todos)
- **GraphQL API** with mutations and queries
- **SQLite Database** for data persistence

## Tech Stack

- **Backend**: Node.js, GraphQL (Apollo Server)
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Project Structure

```
server/
├── src/
│   ├── database/
│   │   └── connect.js          # Database connection
│   ├── graphql/
│   │   ├── resolvers.js        # GraphQL resolvers
│   │   └── typeDefs.js         # GraphQL schema
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── models/
│   │   ├── user.js             # User model
│   │   └── todo.js             # Todo model
│   └── utils/
│       ├── bcrypt.js           # Password hashing utilities
│       └── jwt.js              # JWT utilities
├── .env                        # Environment variables
├── package.json
└── server.js                   # Main server file
```

## Setup & Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd graphql-todo-app

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=4000
```

### 3. Install Required Packages

```bash
npm install @apollo/server graphql sqlite3 bcrypt jsonwebtoken dotenv
```

### 4. Run the Server

```bash
npm start
# or
node server.js
```

The server will start at `http://localhost:4000/graphql`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Usage

### Authentication Flow

1. **Register** a new user or **Login** with existing credentials
2. **Copy the JWT token** from the response
3. **Include the token** in the Authorization header for protected routes

### GraphQL Queries & Mutations

#### 1. Register User

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      username
      email
      created_at
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
}
```

#### 2. Login User

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      username
      email
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "john@example.com",
    "password": "securepassword123"
  }
}
```

#### 3. Create Todo (Protected)

**Headers:**
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

```graphql
mutation CreateTodo($input: CreateTodoInput!) {
  createTodo(input: $input) {
    id
    title
    description
    completed
    created_at
  }
}
```

**Variables:**
```json
{
  "input": {
    "title": "Learn GraphQL",
    "description": "Complete the GraphQL tutorial and build a todo app"
  }
}
```

#### 4. Get All Todos (Protected)

**Headers:**
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

```graphql
query GetTodos {
  todos {
    id
    title
    description
    completed
    created_at
    updated_at
  }
}
```

#### 5. Update Todo (Protected)

**Headers:**
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

```graphql
mutation UpdateTodo($id: ID!, $input: UpdateTodoInput!) {
  updateTodo(id: $id, input: $input) {
    id
    title
    description
    completed
    updated_at
  }
}
```

**Variables:**
```json
{
  "id": "1",
  "input": {
    "title": "Updated Todo Title",
    "completed": true
  }
}
```

#### 6. Delete Todo (Protected)

**Headers:**
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

```graphql
mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id) {
    success
    message
  }
}
```

**Variables:**
```json
{
  "id": "1"
}
```

## Testing the API

### Using curl

1. **Login to get token:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($input: LoginInput!) { login(input: $input) { token user { id username email } } }",
    "variables": { "input": { "email": "john@example.com", "password": "securepassword123" } }
  }'
```

2. **Create todo with token:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token-here>" \
  -d '{
    "query": "mutation CreateTodo($input: CreateTodoInput!) { createTodo(input: $input) { id title description completed } }",
    "variables": { "input": { "title": "Test Todo", "description": "Test Description" } }
  }'
```

### Using GraphQL Clients

- **Apollo Studio Sandbox** (if browser extensions don't interfere)
- **Postman** (recommended)
- **Insomnia**
- **GraphQL Playground**

## Error Handling

The API includes comprehensive error handling for:

- **Authentication errors** (invalid credentials, expired tokens)
- **Authorization errors** (accessing unauthorized resources)
- **Validation errors** (missing required fields)
- **Database constraint errors** (duplicate emails/usernames)

## Security Features

- **Password hashing** using bcrypt
- **JWT authentication** with expiration (24 hours)
- **User authorization** (users can only access their own data)
- **Input validation** and sanitization
- **SQL injection protection** through parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

## Troubleshooting

### Common Issues

1. **"JWT_SECRET must have a value"**
   - Make sure your `.env` file exists and contains `JWT_SECRET`
   - Restart the server after adding environment variables

2. **"Not Authenticated" errors**
   - Ensure you're including the Authorization header: `Authorization: Bearer <token>`
   - Check that your token is valid and not expired

3. **Database errors**
   - Make sure SQLite database file has proper permissions
   - Check that tables are created with correct schema

4. **Browser extension interference**
   - Try using Postman or curl instead of Apollo Studio
   - Temporarily disable browser extensions

### Debug Mode

Enable detailed logging by checking the console output. The application includes comprehensive debug logs for authentication and database operations.
