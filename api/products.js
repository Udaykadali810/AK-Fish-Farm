import { getProducts, saveProducts } from './lib/storage';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const products = await getProducts();
                res.status(200).json(products);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch products' });
            }
            break;

        case 'POST':
            try {
                const products = await getProducts();
                const newProduct = {
                    ...req.body,
                    id: Date.now(),
                    updatedAt: new Date().toISOString()
                };
                products.push(newProduct);
                if (await saveProducts(products)) {
                    res.status(201).json(newProduct);
                } else {
                    res.status(500).json({ error: 'Failed to save product' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;

        case 'PUT':
            try {
                const products = await getProducts();
                const { id, ...updates } = req.body;
                const index = products.findIndex(p => p.id === parseInt(id));

                if (index > -1) {
                    products[index] = {
                        ...products[index],
                        ...updates,
                        updatedAt: new Date().toISOString()
                    };
                    if (await saveProducts(products)) {
                        res.status(200).json(products[index]);
                    } else {
                        res.status(500).json({ error: 'Failed to update product' });
                    }
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;

        case 'DELETE':
            try {
                const products = await getProducts();
                const { id } = req.query;
                const filteredProducts = products.filter(p => p.id !== parseInt(id));

                if (products.length !== filteredProducts.length) {
                    if (await saveProducts(filteredProducts)) {
                        res.status(200).json({ message: 'Product deleted' });
                    } else {
                        res.status(500).json({ error: 'Failed to delete product' });
                    }
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
