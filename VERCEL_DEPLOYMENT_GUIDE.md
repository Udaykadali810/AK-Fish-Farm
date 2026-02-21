# 🚀 AK Fish Farms - Vercel Deployment Guide (v2.0 - Serverless)

## Current Status: Refactored & Optimized
The site has been converted from a complex React/Node app into a high-performance **Serverless Static Site** with **Firebase Firestore**.

### ✅ Key Improvements:
- **No Build Step:** Direct deployment of static files (HTML/CSS/JS).
- **Global Real-time DB:** Firebase Firestore handles all products and orders.
- **Root Deployment:** Files are now in the root directory for maximum compatibility.

---

## 🔧 Required Vercel Dashboard Settings

**CRITICAL:** You must update these settings in your Vercel Dashboard to match the new structure.

### **Build & Development Settings:**

1. **Framework Preset:** `Other` (or "None")
2. **Root Directory:** `.` (The main folder itself, NOT the old `frontend`)
3. **Build Command:** (Leave Blank)
4. **Output Directory:** (Leave Blank)
5. **Install Command:** (Leave Blank)

### **How to Update:**
1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ak-fish-farm`
3. Go to: **Settings** → **General**
4. Set **Root Directory** to `.` (if it was `frontend`)
5. **Override** Build/Output/Install commands and leave them **empty**.
6. Click **Save**.
7. Go to **Deployments** tab.
8. Click **Redeploy** on the latest commit (ensure it says "Refactor project structure...").

---

## 🔐 Admin Panel Access

The admin panel is now split into Login and Dashboard for security.

- **Login URL:** `/admin-login` (or `admin-login.html`)
- **Dashboard URL:** `/admin` (or `admin-dashboard.html`) - *Protected by auth guard*

**Credentials:**
- **Username:** `admin`
- **Password:** `AKFish2026`

*To change these, go to the Security section within the Admin Dashboard.*

---

## 📁 Optimized Project Structure

```
AK fish Farms/
├── index.html            ← Homepage / Shop
├── cart.html             ← My Cart
├── checkout.html         ← Place Order
├── orders.html           ← Real-time Order Tracking
├── admin-login.html      ← Management Entry
├── admin-dashboard.html  ← Product & Order Management
├── assets/               ← Images & Banners
├── styles/               ← Global CSS
├── scripts/              ← Firebase & UI Logic
├── vercel.json           ← Vercel Routing & Cache Config
└── legacy_backup/        ← Archived old files
```

---

## 🧪 Testing After Deployment

1. **Visit Home:** Ensure products load (using skeletons first).
2. **Add to Cart:** Verify items show up in the cart badge.
3. **Checkout:** Complete a mock order; verify summary shows correctly.
4. **Admin Login:** Log in at `/admin-login` and verify you can see the Dashboard stats.
5. **Real-time Update:** Change a product price in the Admin panel and see it update instantly on the Shop page.

---

## 📞 Support

The site is now optimized for Vercel's Edge network. If you see a 404, check that the **Root Directory** in Vercel settings is set to the base folder and not `frontend`.
