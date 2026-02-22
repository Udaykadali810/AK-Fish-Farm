import { db, initDb, withJson } from './lib/db';

async function handler(req, res) {
    const { method } = req;
    await initDb();

    switch (method) {
        case 'GET':
            console.log('📦 Fetching Products...');
            const { rows: products } = await db`SELECT * FROM products ORDER BY id DESC`;
            return res.status(200).json(products);

        case 'POST':
            const { name, price, img, category, status, desc } = req.body;
            console.log(`➕ Adding Product: ${name}`);
            const { rows: newProduct } = await db`
                INSERT INTO products (name, price, img, category, status, description)
                VALUES (${name}, ${price}, ${img}, ${category}, ${status}, ${desc})
                RETURNING *
            `;
            return res.status(201).json(newProduct[0]);

        case 'PUT':
            const { id, name: uName, price: uPrice, img: uImg, category: uCat, status: uStat, description: uDesc } = req.body;
            console.log(`📝 Updating Product ID: ${id}`);
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
            console.log(`🗑️ Deleting Product ID: ${delId}`);
            await db`DELETE FROM products WHERE id = ${delId}`;
            return res.status(200).json({ success: true });

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
}

export default withJson(handler);
