# 🔐 AK Fish Farms — Admin Credentials & Deployment Guide

## ✅ Current Status: ALL BUGS FIXED (Feb 2026)

---

## 🔑 Admin Login Credentials

**Login URL:** `https://ak-fish-farm-lu3i.vercel.app/admin-login`

```
Username: admin
Password: admin123
```

> ⚠️ **Change these** by setting `ADMIN_USER` and `ADMIN_PASS` in Vercel Environment Variables (see below).

---

## 🧱 Vercel Environment Variables (REQUIRED)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these 3 variables:

| Variable        | Value                                       | Required |
|-----------------|---------------------------------------------|----------|
| `POSTGRES_URL`  | `postgresql://...` (from Neon / Vercel PG)  | ✅ YES   |
| `ADMIN_USER`    | `admin`                                     | Optional |
| `ADMIN_PASS`    | `admin123` (change this!)                   | Optional |

> If `ADMIN_USER` / `ADMIN_PASS` are not set, defaults are `admin` / `admin123`.

---

## 🚀 After Deployment — First-Time Setup

### Step 1: Check Health
Visit: `https://ak-fish-farm-lu3i.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "environment": {
    "POSTGRES_URL": "✅ Set",
    "ADMIN_USER": "✅ Set"
  },
  "database": {
    "connected": true,
    "tables": ["admin_users", "coupons", "offers", "orders", "products", "settings"]
  }
}
```

### Step 2: Seed the Database (ONE TIME ONLY)
Visit: `https://ak-fish-farm-lu3i.vercel.app/api/seed`

This will insert:
- ✅ 12 products into the `products` table
- ✅ 2 default offers (`AK10` = 10% off, `FISH50` = ₹50 flat)
- ✅ Admin user from `ADMIN_USER` / `ADMIN_PASS` env vars

> Safe to re-run — it skips tables that already have data.

### Step 3: Test Admin Login
1. Go to: `https://ak-fish-farm-lu3i.vercel.app/admin-login`
2. Enter username + password
3. You should reach the admin dashboard

---

## 🐛 What Was Fixed

### Root Cause
The API files used **ES Module syntax** (`import`/`export`) but Vercel expected **CommonJS** (`require`/`module.exports`). This caused all API routes to crash and return HTML error pages instead of JSON — hence "Server returned a non-JSON error".

### Fixes Applied

| File | Fix |
|------|-----|
| `api/lib/db.js` | Rewrote to CommonJS, uses `createPool` + parameterized queries |
| `api/admin.js` | CommonJS + reads `ADMIN_USER`/`ADMIN_PASS` env vars directly |
| `api/orders.js` | CommonJS + proper parameterized queries |
| `api/products.js` | CommonJS + handles `desc`/`description` fields |
| `api/offers.js` | CommonJS + maps snake_case → camelCase for frontend |
| `api/coupons.js` | CommonJS + parameterized queries |
| `api/settings.js` | CommonJS + upsert with parameterized queries |
| `api/health.js` | NEW — debug endpoint to check env + DB status |
| `api/seed.js` | NEW — safely seeds DB with initial data |
| `vercel.json` | Added `functions` config specifying `nodejs18.x` runtime |
| `package.json` | Removed any `"type": "module"` (would break CJS), added `pg` |
| `scripts/admin-script.js` | `changePassword` now calls `/api/admin` PUT instead of LocalStorage |
| `scripts/script.js` | `applyCoupon` fetches from `/api/offers` (Postgres) first |

---

## 🧪 API Endpoints (All Return JSON)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | DB connection status + env vars check |
| GET | `/api/seed` | Seed database with initial data |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Add product |
| PUT | `/api/products` | Update product |
| DELETE | `/api/products?id=X` | Delete product |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders?id=X` | Track specific order |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders` | Update order status |
| GET | `/api/offers` | List all offers |
| POST | `/api/offers` | Add offer |
| PUT | `/api/offers` | Toggle offer status |
| DELETE | `/api/offers?id=X` | Delete offer |
| POST | `/api/admin` | Admin login |
| PUT | `/api/admin` | Change password |
| GET | `/api/settings` | Get global settings |
| POST | `/api/settings` | Update settings |
| GET | `/api/coupons` | List coupons |
| GET | `/api/coupons?code=X` | Validate coupon |
| POST | `/api/coupons` | Add coupon |
