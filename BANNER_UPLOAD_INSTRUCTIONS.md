# AK Fish Farms Banner Upload Instructions

## IMPORTANT: Banner Image Setup

The Home page has been updated to display the business banner, but you need to add the actual banner image file.

### Steps to Add the Banner Image:

1. **Save the banner image** that you provided in the conversation
2. **Rename it to**: `ak-fish-farms-banner.png`
3. **Place it in**: `frontend/public/` folder
4. **Replace the empty placeholder** file that was created

### File Path:
```
AK fish Farms/
└── frontend/
    └── public/
        └── ak-fish-farms-banner.png  ← Place your banner here
```

### Image Requirements:
- **Format**: PNG (preferred) or JPG
- **Quality**: High resolution for crisp display
- **Size**: Optimized for web (compressed if large)
- **Dimensions**: Original aspect ratio maintained

### What's Already Done:
✅ Home page component updated with responsive banner section
✅ Premium curved glass card container added
✅ Fully responsive styling for mobile and desktop
✅ Contact quick-access buttons for mobile users
✅ Smooth fade-in animations
✅ Object-fit: contain (no cropping)
✅ All text and QR code will remain fully visible

### After Adding the Image:
1. The banner will automatically display on the home page
2. Test on both mobile and desktop views
3. Verify all details (phone numbers, QR code) are clearly visible
4. Commit and push to deploy to Vercel

---

**Banner Location in Website Flow:**
Navbar → Business Ticker → **Business Banner** → Hero Section → Categories → Products
