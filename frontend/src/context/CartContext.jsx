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

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            getCartTotal,
            clearCart,
            placeOrder,
            orders,
            lastAddedItem,
            setLastAddedItem
        }}>
            {children}
        </CartContext.Provider>
    );
};
