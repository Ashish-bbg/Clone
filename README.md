# Amazon Clone

A full-stack e-commerce application inspired by Amazon, built with **Node.js**, **Express**, **MongoDB**, and **React (frontend planned)**. This project supports user authentication, product listing, cart management, and order placement.

---

## 🚀 Live Demo

- API (Products endpoint): [https://clone-production-8d54.up.railway.app/api/products](https://clone-production-8d54.up.railway.app/api/products)

> **Note:** Endpoints like `/api/cart`, `/api/orders`, and `/api/users` are **protected** and require authentication.

---

## 📦 Features

- **User Authentication**

  - Register and login users
  - JWT-based stateless authentication
  - Protected routes for cart, orders, and user details

- **Product Management**

  - View all products
  - Get details for a single product

- **Cart Management**

  - Add items to cart
  - Update or remove cart items
  - Protected for logged-in users

- **Order Management**

  - Place orders from cart
  - View order history
  - Tracks order status (pending, shipped, delivered, cancelled)

- **Middleware**
  - Authentication middleware to protect routes

---

## 📂 Project Structure

```
controllers/
    authControllers.js
    cartController.js
    ordersControllers.js
    productControllers.js
middleware/
    authMiddleware.js
models/
    addressModel.js
    cartModel.js
    orderModel.js
    productModel.js
    reviewModel.js
    userModel.js
routes/
    authRoutes.js
    cartRoutes.js
    ordersRoutes.js
    productRoutes.js
utils/
    generateTokenResponse.js
server.js
.env
```

---

## 🔧 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd amazon-clone
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=8000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

4. Start the server:

```bash
npm start
```

---

## 🛠 API Endpoints

### Public

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | `/api/products`        | List all products            |
| GET    | `/api/products/:id`    | Get a single product by ID   |
| GET    | `/api/products/search` | Get product by search filter |

### Protected (require JWT token)

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| GET    | `/api/cart`            | Get user's cart       |
| POST   | `/api/cart/add`        | Add item to cart      |
| PUT    | `/api/cart/:productId` | Update cart item      |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| POST   | `/api/orders`          | Place order           |
| GET    | `/api/orders/my`       | Get user orders       |
| POST   | `/api/users/register`  | Register user         |
| POST   | `/api/users/login`     | Login user            |

> **Note:** Access protected routes with an `Authorization` header:  
> `Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 Authentication Flow

1. Register or login to get a JWT token.
2. Include the token in request headers for protected endpoints.
3. Server validates the token via `authMiddleware.js`.

---

## ⚡ Next Steps

- Implement frontend with React to connect API endpoints.
- Add product search and filtering.
- Enhance order tracking with multiple statuses per order.
- Deploy frontend and connect with backend API.
- Implement user roles (admin/user) for product management.

---

## 📌 License

This project is open-source and free to use for learning purposes.
