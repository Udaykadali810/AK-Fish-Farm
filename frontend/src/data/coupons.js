export const coupons = [
    {
        id: 1,
        code: "FIRSTFISH20",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1000,
        description: "Get 20% off on your first order above ₹1000",
        expiryDate: "2026-12-31"
    },
    {
        id: 2,
        code: "AQUASCAPE100",
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 800,
        description: "₹100 flat discount on orders above ₹800",
        expiryDate: "2026-12-31"
    },
    {
        id: 3,
        code: "GUPPYLOVE",
        discountType: "percentage",
        discountValue: 15,
        minOrderAmount: 500,
        description: "15% off on all guppies and tropical fish",
        expiryDate: "2026-06-30"
    }
];
