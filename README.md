# admin-next

The **admin-next** package provides a seamless solution for dynamically managing database tables using Prisma in your Next.js project. It simplifies CRUD operations for all tables with minimal setup.

---

## Installation and Setup

### 1. Install Next.js

To use **admin-next**, first create a Next.js project.

```bash
npx create-next-app@latest my-project
cd my-project
```

### 2. Setup Prisma

Initialize Prisma in your project and configure it with your database.

##### 1. Install Prisma and the Prisma Client:

```bash 
npm install prisma @prisma/client
```

##### 2. Initialize Prisma:
```bash
npx prisma init
```
This will create a prisma folder with a schema.prisma file.

#####  3. Configure your database in `prisma/schema.prisma:`

Open the `schema.prisma` file and update the `datasource` block with your database connection string. Here's an example for a PostgreSQL database:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Users {
  id    Int    @id @default(autoincrement())
  name  String
}
```
Make sure to replace the `DATABASE_URL` with the actual connection string to your database. You can also configure this in the `.env` file.

For example, for PostgreSQL:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```
##### 4. Run Prisma Migrate:
Once your schema is set up, run Prisma Migrate to create the database tables based on your schema.

```bash
npx prisma migrate dev --name init
```
This will create the tables in your database.

##### 5. Generate Prisma Client:
After migrating, run the following command to generate the Prisma Client:

```bash
npx prisma generate
```
This will generate the Prisma Client that will be used to interact with your database in the code.

### 3. Install admin-next Package
```bash
npm install admin-next
```

### 4. Create Admin API Routes
In your Next.js project, create a new file for the admin API routes.

- Create the file `/api/admin/route.js`:

```javascript
import { GetAllModel, handlePost, handleUpdate, handleDelete } from "admin-next";
import { prisma } from "@/lib/prisma"; // Your Prisma client instance
import { initializeAdmin } from "admin-next";

initializeAdmin(prisma);

export { GetAllModel as GET, handlePost as POST, handleUpdate as PATCH, handleDelete as DELETE };
```
- Create the file `src/lib/prisma.js`:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma };
```

### 5. Run the Application
Now, you can run your application with the following command:
```bash
npm run dev
```
Your Next.js application is now set up to use the admin-next package to manage your database tables dynamically.

## Features

- **GetAllModel**: Fetch all records from any model.
- **handlePost**: Handle POST requests to create new records.
- **handleUpdate**: Handle PATCH requests to update existing records.
- **handleDelete**: Handle DELETE requests to remove records.

# Admin API Documentation

This API allows CRUD operations on dynamic models, such as `users`, by specifying the `modelName` query parameter. The following sections explain the available actions and how to use them with Postman.

## Base URL


## Available Endpoints

### 1. GET all table names

```bash
http://localhost:3000/api/admin
```

### 2. **GET `/api/admin?modelName={modelName}`**
This endpoint fetches a list of records for a specified model.

#### Example:
To get all users:
``` bash
GET http://localhost:3000/api/admin?modelName=users
```

### 3. **GET `/api/admin?modelName={modelName}&id={id}`**
This endpoint fetches a single record based on the model and ID.

#### Example:
To get a user with ID `2`:

```bash
GET http://localhost:3000/api/admin?modelName=users&id=2
```
### 4. You can perform all crud operations with given url

```bash
http://localhost:3000/api/admin?modelName=users
```

```bash
http://localhost:3000/api/admin?modelName=users&id=2
```
Here just change method and pass body if needed


