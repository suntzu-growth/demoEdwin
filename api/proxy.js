export default async function handler(req, res) {
    // La URL de n8n la guardaremos en una variable de entorno de Vercel
    const N8N_URL = process.env.N8N_WEBHOOK_URL;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const response = await fetch(N8N_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Error comunicando con n8n' });
    }
}