import fs from 'fs';
import path from 'path';

// This is a "lightweight storage layer" using JSON files.
// Note: On Vercel (Production), the filesystem is read-only.
// For true global persistence without an external DB, Vercel KV is recommended.
// This implementation works for Local Development and as a template.

const PRODUCTS_PATH = path.join(process.cwd(), 'api/data/products.json');
const ORDERS_PATH = path.join(process.cwd(), 'api/data/orders.json');

export function getProducts() {
    try {
        const data = fs.readFileSync(PRODUCTS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading products:', err);
        return [];
    }
}

export function saveProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving products:', err);
        return false;
    }
}

export function getOrders() {
    try {
        const data = fs.readFileSync(ORDERS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading orders:', err);
        return [];
    }
}

export function saveOrder(order) {
    try {
        const orders = getOrders();
        orders.push(order);
        fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving order:', err);
        return false;
    }
}
export function saveOrders(orders) {
    try {
        fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving orders:', err);
        return false;
    }
}
const OFFERS_PATH = path.join(process.cwd(), 'api/data/offers.json');

export function getOffers() {
    try {
        if (!fs.existsSync(OFFERS_PATH)) return [];
        const data = fs.readFileSync(OFFERS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading offers:', err);
        return [];
    }
}

export function saveOffers(offers) {
    try {
        fs.writeFileSync(OFFERS_PATH, JSON.stringify(offers, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving offers:', err);
        return false;
    }
}
