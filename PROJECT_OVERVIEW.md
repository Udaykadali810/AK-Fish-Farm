# 🌊 AK Fish Farms - Project Technical Portfolio

A high-performance, premium e-commerce platform built for **AK Fish Farms**, designed to provide an immersive aquatic species acquisition experience.

---

## 🛠️ Tech Stack Overview

The project utilizes a modern **MERN-inspired architecture** optimized for high-fidelity animations and serverless performance.

### **Frontend (The Client Side)**
- **React 19 (Vite)**: The core engine, chosen for its extreme speed, Hot Module Replacement (HMR), and efficient rendering.
- **Tailwind CSS (PostCSS)**: A utility-first CSS framework used to build our custom **"Aquatic Design System"** without writing bloated CSS.
- **Framer Motion**: Powering our high-end 3D effects, spring animations, and smooth page transitions.
- **Lucide React**: A collection of beautiful, lightweight vector icons used across the navigation and UI.
- **React Router Dom (v7)**: Handling lightning-fast, zero-refresh client-side routing.

### **Backend & Infrastructure**
- **Vercel Serverless Functions**: Our API (`/api/index.js`) runs on the edge, ensuring zero cold starts and global low latency.
- **Node.js**: The runtime environment for our server-side protocol logic.
- **Global Hosting**: Full CI/CD integration with **GitHub & Vercel**, enabling automatic deployments on every update.

### **Data & Utilities**
- **React Context API**: Managing global state for the Shopping Cart, User Authentication, and Real-time Notifications.
- **Persistence Layer**: Utilizing Browser `localStorage` for cross-session cart persistence and order record keeping.
- **External Integrations**:
  - **Firebase**: Integrated for high-priority data collection and AI agent inquiries.
  - **QR Server API**: Dynamic generation of location-based QR codes for the contact section.
  - **XLSX**: Library used for exporting institutional order data into Excel formats.

---

## 🚀 Key Features Implemented

### **1. Immersive Aquatic UI/UX**
- **Dark Ocean Aesthetics**: A custom palette featuring Deep Ocean Blue (`#071A2F`), Navy Blue (`#0B2A4A`), and Neon Aqua (`#00E5FF`).
- **Glassmorphism**: Advanced backdrop-blur filters and glowing borders to simulate water-like transparency.
- **Hover-Lift Animation**: 3D perspective transforms on product cards for a premium feel.

### **2. Mobile-First Optimization**
- **Flipkart-Style Bottom Nav**: A dedicated mobile navigation bar with real-time cart badges and animated active states.
- **2-Column Responsive Grid**: Optimized shop layout for mobile browsing without sacrificing readability.
- **Touch-Ergonomic UI**: Large-target action buttons and stacked layouts for one-handed operation.

### **3. Full-Cycle Ecommerce Engine**
- **Dynamic Cart System**: Real-time quantity updates, subtotal calculations, and discount coupon logic.
- **Secure Checkout Protocol**: Multi-step order generation with unique ID tracking.
- **Order Tracking Interface**: A dedicated system to monitor species delivery timelines.

### **4. Interactive Communication**
- **AI Assistant Widget**: A floating chat agent to guide hobbyists through species selection.
- **Location QR Protocol**: Integrated QR scanning for direct Google Maps navigation to the farm.
- **Direct WhatsApp Tunnel**: Floating communication bridge for immediate proprietor access.

---

## 📊 Summary of Accomplishments
- **Phase 1**: Brand Identity & Foundation (Theme & Navigation).
- **Phase 2**: Inventory Deployment (Shop Grid & Product Details).
- **Phase 3**: Ecommerce Logic (Cart, Checkout & Tracking).
- **Phase 4**: Premium Optimization (Mobile Redesign, Price Glows & QR Integration).

**Developed by: AK Fish Farms Development Team**
*Live Status: Deployed on Vercel*
