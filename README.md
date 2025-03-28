# PharmEasy Clone

## Introduction

The rise of digital health services has made online pharmacies a crucial element in the healthcare industry, providing patients with easy access to essential medicines and healthcare products from the comfort of their homes. A well-designed online pharmacy platform not only ensures convenience but also enhances user trust through seamless interactions and secure handling of sensitive information like prescriptions and order details.

## Project Type

**Fullstack** (MERN Stack with EJS-based server-side rendering)

## Deployed App

Frontend: [https://deployed-site.whatever](https://deployed-site.whatever)
Backend: [https://api.deployed-site.whatever](https://api.deployed-site.whatever)

## Directory Structure

```
my-app/
├─ config/            # Configuration files (DB, authentication, etc.)
├─ controllers/       # Route handlers and business logic
├─ middlewares/       # Middleware functions (auth, validation, etc.)
├─ models/            # Mongoose schemas
├─ public/            # Static assets (CSS, JS, images, etc.)
├─ routes/            # Express route definitions
├─ utils/             # Utility functions
├─ views/             # EJS templates for server-side rendering
├─ app.js             # Main application entry point
├─ package-lock.json  # Auto-generated dependency lock file
├─ package.json       # Project dependencies and metadata
├─ README.md          # Documentation
```

## Video Walkthrough of the Project

_A very short video walkthrough (1-3 minutes) showcasing the core features._

## Video Walkthrough of the Codebase

_A very short video walkthrough (1-5 minutes) explaining the project structure and key files._

## Features

### **User Panel**

- User authentication (Google OAuth 2.0, Facebook Login)
- Search and filter medicines with advanced search
- Dynamic pricing alerts
- Order tracking and status updates
- Health profile management

### **Admin Panel**

- Dashboard with total users, orders, and sales analytics
- Manage products, categories, and discounts
- Add new pincodes for delivery
- User management

## Design Decisions & Assumptions

- **Backend-rendered frontend** using **EJS** to keep things simple and SEO-friendly.
- **MongoDB as the database** for storing user, product, and order data.
- **Redis for caching** to enhance performance in real-time operations.
- **JWT authentication** for secure user sessions.
- **Multer for file uploads** (prescriptions, product images).
- **Claudinary** (for images upload)

## Installation & Getting Started

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/pharmeasy-clone.git
cd pharmeasy-clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update .env with your MongoDB URL, API keys, etc.

# Start the server
npm run start
```

For MongoDB setup, ensure you have a running instance or use MongoDB Atlas.

## Usage

1. **Sign Up/Login** using Google OAuth or register manually.
2. **Search for medicines** and add them to the cart.
3. **Upload a prescription** (if required) and proceed to checkout.

## Credentials for Testing

```
Admin Login:
Email: abckewat@gmail.com
Password: admin123

User Login:
Email: alice@gmail.com
Password: aaaaaaaa
```

## APIs Used

- Google OAuth 2.0 for authentication
- MongoDB Atlas for database storage
- Claudinary for images uploading
- Stripe/Razorpay for payments (if applicable)

## API Endpoints

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | /api/products    | Get all products                     |
| POST   | /api/products    | Add a new product (Admin only)       |
| GET    | /api/cart        | Get user cart details                |
| POST   | /api/cart/add    | Add item to cart                     |
| PUT    | /api/cart/update | Update cart item quantity            |
| DELETE | /api/cart/remove | Remove item from cart                |
| POST   | /api/checkout    | Process checkout and order placement |

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Redis
- **Frontend**: EJS, Bootstrap, Vanilla JavaScript
- **Authentication**: Google OAuth 2.0, JWT
- **Real-time Features**: Socket.io
- **Caching**: Redis
- **Storage**: Multer for file uploads (prescriptions, images)
- **Deployment**: DigitalOcean/AWS/Vercel (specify if deployed)

---

### 🚀 This project is actively maintained! Contributions and feedback are welcome.
