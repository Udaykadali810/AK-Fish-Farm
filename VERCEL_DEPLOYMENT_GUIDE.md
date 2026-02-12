# 🚀 AK Fish Farms - Vercel Deployment Guide

## Current Status: Troubleshooting 404 Errors

### ✅ What's Working:
- Frontend builds successfully locally
- API endpoint `/api/test` works and returns proper response
- Code is pushed to GitHub

### ❌ What's Not Working:
- Frontend pages showing 404 errors on Vercel
- Likely a build configuration issue

---

## 🔧 Required Vercel Dashboard Settings

### **Build & Development Settings:**

1. **Framework Preset:** `Vite`
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`
6. **Node.js Version:** `20.x` (or latest)

### **How to Update:**
1. Go to: https://vercel.com/dashboard
2. Select your project: `ak-fish-farm`
3. Go to: **Settings** → **General**
4. Scroll to: **Build & Development Settings**
5. Click **Edit** and update the values above
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** (uncheck "Use existing build cache")

---

## 📋 Troubleshooting Checklist

### Check Build Logs:
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click on **Build Logs** tab
4. Look for errors related to:
   - `npm install` failures
   - `npm run build` failures
   - Missing dependencies
   - Path issues

### Common Issues:

#### Issue 1: Build Command Not Found
**Error:** `Command "npm run build" not found`
**Solution:** Make sure Root Directory is set to `frontend`

#### Issue 2: Output Directory Not Found
**Error:** `Error: No Output Directory named "dist" found`
**Solution:** Check that Build Command is `npm run build` (not `vite build`)

#### Issue 3: Dependencies Not Installing
**Error:** `npm ERR! code ERESOLVE`
**Solution:** Try setting Install Command to `npm install --legacy-peer-deps`

---

## 🔐 Admin Credentials

Once deployment is successful:

**Login URL:** https://ak-fish-farm-lu3i.vercel.app/admin/login

**Credentials:**
- Email: `admin@akfishfarms.com`
- Password: `AKFish2026!`

---

## 📁 Project Structure

```
AK fish Farms/
├── frontend/              ← Root Directory in Vercel
│   ├── dist/             ← Build output
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── api/                  ← Backend code (not used in current deployment)
├── api.js                ← Serverless function (not currently working)
├── api_functions/        ← Alternative API location
└── vercel.json           ← Deployment config
```

---

## 🧪 Testing After Deployment

### 1. Test Homepage:
Visit: https://ak-fish-farm-lu3i.vercel.app
Expected: Homepage loads with navigation, products, etc.

### 2. Test API:
Visit: https://ak-fish-farm-lu3i.vercel.app/api/test
Expected: JSON response with "Backend is working on Vercel!"

### 3. Test Admin Login:
Visit: https://ak-fish-farm-lu3i.vercel.app/admin/login
Expected: Login page loads
Action: Enter credentials and login

---

## 🆘 Next Steps if Still Not Working

1. **Share Build Logs:** Copy the full build log from Vercel
2. **Check Deployment Summary:** Look for "Functions" section
3. **Verify Settings:** Double-check all settings match this guide
4. **Try Manual Deploy:** Use Vercel CLI to deploy locally

---

## 📞 Support

If issues persist, we need to see:
1. Full build logs from Vercel
2. Screenshot of Build & Development Settings
3. Screenshot of Deployment Summary
