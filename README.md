# AK Fish Farms - Premium E-commerce & Admin Panel

A modern, fully responsive aquatic-themed e-commerce platform for an aquarium fish business.

## 🚀 Built With
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Multer.
- **Theme:** Premium Aquatic (Blue + Aqua + White) with Glassmorphism.

## 📦 Features
### Customer Side
- **Home:** Featured products, categories, and hero animations.
- **Shop:** Advanced filtering by category, sorting, and search.
- **Product Details:** High-quality image gallery, stock status, and descriptions.
- **Cart:** Add/Remove items, update quantities, and coupon application.
- **Checkout:** Secure COD and UPI payment options.
- **Orders:** Track order history and current status.
- **Profile:** Manage personal and shipping information.
- **Communication:** Floating WhatsApp button and Instagram integration.

### Admin Panel
- **Dashboard:** Sales statistics and recent order overview.
- **Product Management:** Full CRUD with image uploads using Multer.
- **Order Management:** Update order status (Ordered, Shipped, Delivered, Cancelled).
- **Coupon Management:** Create and manage discount codes.

## 🛠️ Local Setup

### 1. Backend Setup
1. Open terminal in `backend` folder.
2. Run `npm install`.
3. Create a `.env` file (already created with defaults) and add your **MongoDB Atlas URI**.
4. Run `npm run dev` or `nodemon server.js`.
5. **Optional:** Run `node seed.js` to populate the database with sample fish and an admin user.
   - **Admin Credentials:** `admin@akfishfarms.com` / `adminpassword`

### 2. Frontend Setup
1. Open terminal in `frontend` folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## 🌐 Free Deployment Steps

### Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **FREE Tier** cluster.
3. Create a Database User.
4. Add your IP to the IP Whitelist.
5. Get the Connection String and paste it in `backend/.env`.

### Backend (Render - Free)
1. Create an account on [Render](https://render.com/).
2. Create a new **Web Service** and connect your GitHub repo.
3. Set Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.).
4. Use Build Command: `npm install` and Start Command: `node server.js`.

### Frontend (Vercel - Free)
1. Create an account on [Vercel](https://vercel.com/).
2. Import your project.
3. Set the Root Directory to `frontend`.
4. In Environment Variables, set `VITE_API_URL` to your Render backend URL.
5. Deploy!

---
Developed for **AK Fish Farms** 🐠
