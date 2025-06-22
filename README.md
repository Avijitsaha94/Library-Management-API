Library Management API
A RESTful API built using Express.js, TypeScript, and MongoDB to manage library books, borrowing, and return history.

 Features
 CRUD Operations on Books

 Manage Borrowers (Students)

 Borrow & Return Books

 Borrow History Record

 Zod validation for input data

 MongoDB for Data Storage

⚙️ Technologies Used
Backend: Express.js (with TypeScript)
Database: MongoDB with Mongoose
Dev Tools: Nodemon, ts-node, dotenv
Deployment: Vercel

🚀 Getting Started
🧑‍💻 Local Setup Instructions
Clone the Repository

cd library-management-api
Install Dependencies


npm install
Create .env File


PORT=5000
MONGO_URI=your_mongodb_uri
Start the Server


npm run dev
Server will run at: http://localhost:5000

API Endpoints
 Book Routes
Method	Endpoint	Description
POST	/api/books	Create a new book
GET	/api/books	Get all books
GET	/api/books/:bookId	Get a single book
PUT	/api/books/:bookId	Update a book
DELETE	/api/books/:bookId	Delete a book

 Borrow Routes
Method	Endpoint	Description
POST	/api/borrow	Borrow a book
POST	/api/return	Return a book


🔹 Sample Request (Book)
POST /api/books

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Programming",
  "status": "available"
}
 Project Structure

src/
├── app.ts

│  
├── routes/
│   ├── book.route.ts
│   ├── borrow.route.ts
├── controllers/
│   ├── book.controller.ts
│   ├── borrow.controller.ts
├── models/
│   ├── book.model.ts
│   ├── borrow.model.ts














