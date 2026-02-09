# Notervo Ecommerce Backend API

Node.js + Express + MongoDB backend powering Notervo notebook ecommerce.

## Modules

- Authentication and user management
- Notebook product catalog CRUD
- Cart and wishlist
- Orders and coupon handling
- Subscriber management
- User/admin messaging
- Website settings

## Product Filtering

Supported filters on `GET /api/products`:

- `category`
- `brand`
- `minPrice`
- `maxPrice`
- `discounted`
- `q` (search query)
- `page`, `limit`

Examples:

```txt
GET /api/products?category=daily&brand=Notervo&maxPrice=1000
GET /api/products?category=creative&minPrice=200&maxPrice=500
GET /api/products?discounted=true
GET /api/products?q=grid notebook
```

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/cart`
- `POST /api/cart/add/:id`
- `GET /api/orders`
- `POST /api/orders`

## Run Locally

```bash
npm install
npm start
```

Create `.env`:

```env
PORT=5000
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
```

## Notes

- Product images are uploaded to Cloudinary and stored as secure URLs.
- Email templates use Notervo monochrome branding.
