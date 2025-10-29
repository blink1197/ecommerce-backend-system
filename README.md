# ECommerce Backend System
The ECommerce Backend System is a RESTful service built with Express.js and MongoDB.
* It provides endpoints for managing users, products, carts, and orders.
* This API supports authentication, admin privileges, and standard e-commerce operations such as:
* User registration, login, and profile retrieval
* Product creation, retrieval, updating, and search
* Cart management (add, update, remove items)
* Order creation and tracking
* Admin-only access for managing users and products

You can check out this project's full Postman Documentation at
[https://documenter.getpostman.com/view/49213711/2sB3Wjx2vs](https://documenter.getpostman.com/view/49213711/2sB3Wjx2vs)

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT  
- **Architecture:** RESTful API design  

---
## Features Overview

### User Resources
- User registration  
- User authentication  
- Set user as admin *(Admin only)*  
- Retrieve user details  
- Update password  

### Product Resources
- Product creation  
- Get all products  
- Get all active products  
- Get product by ID  
- Update product  
- Archive product  
- Activate product  
- Search product by name  
- Search product by price  

### Cart Resources
- Get cart  
- Add to cart  
- Get cart quantity  
- Remove item from cart  
- Clear cart  

### Order Resources
- Create order  
- Retrieve all orders *(Admin only)*  
- Retrieve user’s orders  

---

## API Endpoints

| Category | Method | Endpoint | Description |
|-----------|--------|-----------|-------------|
| **Users** | POST | `/users/register` | Register a new user |
|  | POST | `/users/login` | Authenticate user and return token |
|  | PATCH | `/users/:id/set-as-admin` | Set user as admin *(Admin only)* |
|  | GET | `/users/details` | Retrieve logged-in user details |
|  | PATCH | `/users/update-password` | Update user password |
| **Products** | POST | `/products` | Create a new product *(Admin only)* |
|  | GET | `/products/all` | Get all products |
|  | GET | `/products/active` | Get all active products |
|  | GET | `/products/:id` | Get product by ID |
|  | PATCH | `/products/:id/update` | Update product details *(Admin only)* |
|  | PATCH | `/products/:id/archive` | Archive product *(Admin only)* |
|  | PATCH | `/products/:id/activate` | Activate product *(Admin only)* |
|  | POST | `/products/search-by-name` | Search product by name |
|  | POST | `/products/search-by-price` | Search product by price range |
| **Cart** | GET | `/cart` | Retrieve user’s cart |
|  | POST | `/cart/add-to-cart` | Add product to cart |
|  | PATCH | `/cart/update-card-quantity` | Update cart item's quantity |
|  | PATCH | `/cart/:productId/remove-from-cart/` | Remove item from cart |
|  | PUT | `/cart/clear-cart` | Clear all items from cart |
| **Orders** | POST | `/orders/checkout` | Create an order |
|  | GET | `/orders/all-orders` | Retrieve all orders *(Admin only)* |
|  | GET | `/orders/user` | Retrieve logged-in user’s orders |

---

## ⚙️ Setup & Run Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/blink1197/ecommerce-backend-system.git
cd ecommerce-backend-system
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a .env file in the project root and include the following key-value pairs. You can refer to the .env.sample.
```bash
PORT=4000
MONGODB_STRING=<your_mongodb_connection_string>
JWT_SECRET_KEY=<your_secret_key>
```
### 4. Run the server
```bash
npm run start
```
The server should now be running on http://localhost:4000

### 5. Test the Endpoints
Use an API testing tool such as Postman or Thunder Client to access and test the endpoints listed above.

---
## Appendices
Entity Relationship Diagram (ERD)
* ERD Source: [ERD (draw.io)](https://drive.google.com/file/d/1kx-JLStiKWyN0SWp2JCUezvPKSmst0Oc/view)



