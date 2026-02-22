import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

/**
 * GLOBAL STORAGE LAYER (Vercel KV + JSON Fallback)
 * This layer ensures data is synchronized across all users globally on Vercel.
 * If KV_URL is not set, it falls back to local JSON files (for local dev).
 **/

const IS_KV_ENABLED = !!process.env.KV_URL;

// Local file paths
const DATA_DIR = path.join(process.cwd(), 'api/data');
const FILE_PATHS = {
    products: path.join(DATA_DIR, 'products.json'),
    orders: path.join(DATA_DIR, 'orders.json'),
    offers: path.join(DATA_DIR, 'offers.json'),
    coupons: path.join(DATA_DIR, 'coupons.json')
};

/** Generic Read **/
async function getData(key) {
    if (IS_KV_ENABLED) {
        try {
            const data = await kv.get(key);
            return data || [];
        } catch (err) {
            console.error(`KV Read Error [${key}]:`, err);
        }
    }

    // Local Fallback
    try {
        const filePath = FILE_PATHS[key.replace('akf_', '')];
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (err) {
        console.error(`Local Read Error [${key}]:`, err);
    }
    return [];
}

/** Generic Write **/
async function setData(key, data) {
    if (IS_KV_ENABLED) {
        try {
            await kv.set(key, data);
            return true;
        } catch (err) {
            console.error(`KV Write Error [${key}]:`, err);
        }
    }

    // Local Fallback (only works on local machine, not Vercel prod)
    try {
        const filePath = FILE_PATHS[key.replace('akf_', '')];
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error(`Local Write Error [${key}]:`, err);
        return false;
    }
}

/* --- API Facades --- */

export const getProducts = () => getData('akf_products');
export const saveProducts = (data) => setData('akf_products', data);

export const getOrders = () => getData('akf_orders');
export const saveOrders = (data) => setData('akf_orders', data);
export const saveOrder = async (order) => {
    const orders = await getOrders();
    orders.push(order);
    return saveOrders(orders);
};

export const getOffers = () => getData('akf_offers');
export const saveOffers = (data) => setData('akf_offers', data);

export const getCoupons = () => getData('akf_coupons');
export const saveCoupons = (data) => setData('akf_coupons', data);
