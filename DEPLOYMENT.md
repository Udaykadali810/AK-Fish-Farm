# 🚀 AK Fish Farms - Vercel Deployment Guide with Neon Database

This guide will help you deploy your AK Fish Farms application to Vercel with a Neon PostgreSQL database.

---

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [Neon Account](https://neon.tech/)
- Git repository (GitHub, GitLab, or Bitbucket)

---

## 🗄️ Step 1: Set Up Neon Database

### 1.1 Create a Neon Project
1. Go to [Neon Console](https://console.neon.tech)
2. Click **"Create a project"**
3. Choose a project name (e.g., `ak-fish-farms`)
4. Select a region (choose closest to your users)
5. Click **"Create project"**

### 1.2 Get Your Database Connection String
1. In your Neon dashboard, go to **"Connection Details"**
2. Copy the **Connection string** (it looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **Save this connection string** - you'll need it for Vercel

### 1.3 (Optional) Initialize Database Schema
You can run migrations locally first:
```bash
# Update api/.env with your Neon DATABASE_URL
cd api
npm install
node index.js
# This will sync your Sequelize models to Neon
```

---

## 🌐 Step 2: Deploy to Vercel

### 2.1 Push Your Code to Git
```bash
git add .
git commit -m "Ready for Vercel deployment with Neon"
git push origin main
```

### 2.2 Import Project to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect the configuration from `vercel.json`

### 2.3 Configure Environment Variables
In the Vercel project settings, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require` | Your Neon connection string |
| `JWT_SECRET` | `your_secure_random_string_here` | JWT signing key (generate a strong one) |
| `NODE_ENV` | `production` | Environment mode |

**How to add:**
1. In Vercel project → **Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development**
3. Click **"Save"**

### 2.4 Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy your app
3. Wait for deployment to complete (usually 2-3 minutes)

---

## ✅ Step 3: Verify Deployment

### 3.1 Test API Endpoints
Visit these URLs (replace `your-app.vercel.app` with your actual domain):

- **Health Check:** `https://your-app.vercel.app/health`
- **API Base:** `https://your-app.vercel.app/api`
- **Test Ping:** `https://your-app.vercel.app/test-ping`

### 3.2 Seed Admin User
After first deployment, you need to create an admin user:

**Option A: Using Vercel CLI**
```bash
vercel env pull .env.local
cd api
npm run seed-admin
```

**Option B: Manually via Neon SQL Editor**
```sql
INSERT INTO "Admins" ("email", "password", "createdAt", "updatedAt")
VALUES (
  'admin@akfishfarms.com',
  '$2a$10$YourHashedPasswordHere',
  NOW(),
  NOW()
);
```

### 3.3 Test Frontend
1. Visit your Vercel URL
2. Navigate to `/admin/login`
3. Try logging in with your admin credentials

---

## 🔧 Project Structure (Vercel-Ready)

```
AK fish Farms/
├── api/                          # Backend (Serverless Functions)
│   ├── index.js                  # Main entry (exports app for Vercel)
│   ├── db.js                     # Database config (Neon/SQLite)
│   ├── .env                      # Environment variables (DO NOT COMMIT)
│   ├── .env.example              # Template for environment variables
│   ├── models/                   # Sequelize models
│   ├── routes/                   # API routes
│   ├── controllers/              # Business logic
│   └── package.json              # Backend dependencies
│
├── frontend/                     # React Frontend
│   ├── src/
│   ├── dist/                     # Build output (auto-generated)
│   └── package.json              # Frontend dependencies
│
├── vercel.json                   # Vercel configuration
├── package.json                  # Root package.json
└── DEPLOYMENT.md                 # This file
```

---

## 🔐 Environment Variables Reference

### Backend (`api/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your_super_secret_key
NODE_ENV=production
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://your-app.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution:**
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Ensure Neon database is active (not suspended)
- Check Neon connection string includes `?sslmode=require`

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
npm run install-all
git add .
git commit -m "Update dependencies"
git push
```

### Issue: API routes return 404
**Solution:**
- Verify `vercel.json` rewrites are correct
- Check that `api/index.js` exports the Express app: `module.exports = app;`

### Issue: Admin login fails
**Solution:**
- Run the seed admin script
- Verify JWT_SECRET is set in Vercel environment variables
- Check browser console for CORS errors

---

## 📊 Database Management

### View Database in Neon Console
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click **"SQL Editor"**
4. Run queries to view/modify data

### Backup Database
Neon provides automatic backups. To create a manual backup:
1. Neon Console → Your Project → **Branches**
2. Create a new branch (snapshot of current state)

### Reset Database
```sql
-- In Neon SQL Editor
DROP TABLE IF EXISTS "Admins", "Users", "Orders", "Offers", "Products", "Inquiries" CASCADE;
```
Then redeploy to recreate tables.

---

## 🎯 Post-Deployment Checklist

- [ ] Neon database created and connection string obtained
- [ ] Environment variables added to Vercel
- [ ] Project deployed successfully
- [ ] Health check endpoint returns 200 OK
- [ ] Admin user seeded
- [ ] Admin login works
- [ ] Frontend loads correctly
- [ ] API endpoints respond properly

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Neon database status
3. Review browser console for frontend errors
4. Check API response in Network tab

---

**🎉 Congratulations! Your AK Fish Farms app is now live on Vercel with Neon PostgreSQL!**
