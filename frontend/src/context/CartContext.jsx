import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('akf_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('akf_orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    const [lastAddedItem, setLastAddedItem] = useState(null);
    const [coupon, setCoupon] = useState(null);

    useEffect(() => {
        localStorage.setItem('akf_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('akf_orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (product) => {
        setLastAddedItem(product);
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
                );
            }
            return [...prevCart, { ...product, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const applyCoupon = (code) => {
        const validCoupons = {
            'AKF10': 10,
            'AKF20': 20,
            'FISH25': 25,
            'WELCOME': 15
        };

        const discountPct = validCoupons[code.toUpperCase()];
        if (discountPct) {
            const subtotal = getCartTotal();
            const discountAmount = (subtotal * discountPct) / 100;
            setCoupon({
                code: code.toUpperCase(),
                percent: discountPct,
                amount: discountAmount
            });
            return { success: true, percent: discountPct };
        }
        return { success: false, message: 'Invalid Protocol Code' };
    };

    const removeCoupon = () => {
        setCoupon(null);
    };

    const getFinalTotal = () => {
        const subtotal = getCartTotal();
        if (coupon) {
            return Math.round(subtotal - coupon.amount);
        }
        return subtotal;
    };

    const clearCart = () => {
        setCart([]);
    };

    const placeOrder = () => {
        const orderId = `AKF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const newOrder = {
            id: orderId,
            items: [...cart],
            total: getCartTotal(),
            date: new Date().toISOString(),
            status: 'Processing',
            timeline: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
        };
        setOrders(prev => [...prev, newOrder]);
        clearCart();
        return newOrder;
    };

    /**
     * initiateWhatsAppOrder
     * Builds a pre-filled WhatsApp message, saves the order to localStorage,
     * clears the cart, opens wa.me, and returns the saved order object.
     */
    const initiateWhatsAppOrder = ({ customerName, phone, place }) => {
        const WHATSAPP_NUMBER = '919492045766';
        const finalTotal = getFinalTotal();
        const orderId = `AKF-2026-${Math.floor(10000 + Math.random() * 90000)}`;

        // Build numbered order lines
        const orderLines = cart
            .map((item, i) => `${i + 1}. ${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}`)
            .join('\n');

        // Optional coupon line
        const couponLine = coupon
            ? `\nCoupon (${coupon.code} -${coupon.percent}%): -₹${Math.round(coupon.amount)}`
            : '';

        // Full formatted WhatsApp message
        const message =
            `🛒 New Order - AK FishFarms\n\n` +
            `Order ID: ${orderId}\n` +
            `Customer Name: ${customerName}\n` +
            `Phone: ${phone}\n` +
            `Address: ${place}\n\n` +
            `Order Details:\n${orderLines}${couponLine}\n\n` +
            `Total Amount: ₹${finalTotal}\n\n` +
            `Thank you for shopping in AK FishFarms 🐟`;

        // Persist order to localStorage
        const newOrder = {
            id: orderId,
            customerName,
            phone,
            place,
            items: [...cart],
            total: finalTotal,
            coupon: coupon || null,
            date: new Date().toISOString(),
            status: 'Processing',
            timeline: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
        };
        setOrders(prev => [...prev, newOrder]);

        // Clear cart and coupon
        clearCart();
        setCoupon(null);

        // Open WhatsApp in new tab
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');

        return newOrder;
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            getCartTotal,
            clearCart,
            placeOrder,
            initiateWhatsAppOrder,
            orders,
            lastAddedItem,
            setLastAddedItem,
            coupon,
            applyCoupon,
            removeCoupon,
            getFinalTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
