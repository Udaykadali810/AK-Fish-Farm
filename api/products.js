import { db, initDb } from './lib/db';

export default async function handler(req, res) {
    const { method } = req;

    try {
        // Ensure DB is ready
        await initDb();

        switch (method) {
            case 'GET':
                const { rows: products } = await db`SELECT * FROM products ORDER BY id DESC`;
                return res.status(200).json(products);

            case 'POST':
                const { name, price, img, category, status, desc } = req.body;
                const { rows: newProduct } = await db`
                    INSERT INTO products (name, price, img, category, status, description)
                    VALUES (${name}, ${price}, ${img}, ${category}, ${status}, ${desc})
                    RETURNING *
                `;
                return res.status(201).json(newProduct[0]);

            case 'PUT':
                const { id, name: uName, price: uPrice, img: uImg, category: uCat, status: uStat, description: uDesc } = req.body;
                const { rows: updatedProduct } = await db`
                    UPDATE products 
                    SET name = ${uName}, price = ${uPrice}, img = ${uImg}, 
                        category = ${uCat}, status = ${uStat}, description = ${uDesc},
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${id}
                    RETURNING *
                `;
                return res.status(200).json(updatedProduct[0]);

            case 'DELETE':
                const { id: delId } = req.query;
                await db`DELETE FROM products WHERE id = ${delId}`;
                return res.status(200).json({ success: true });

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Products API Error:', error);
        return res.status(500).json({ error: 'Database Connection Error' });
    }
}
