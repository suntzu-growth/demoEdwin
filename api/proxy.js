export default async function handler(req, res) {
    const N8N_URL = process.env.N8N_WEBHOOK_URL;

    if (!N8N_URL) return res.status(500).json({ error: "Falta URL de n8n" });
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    try {
        const response = await fetch(N8N_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const contentType = response.headers.get("content-type");
        
        // Si n8n devuelve JSON, lo enviamos tal cual
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return res.status(200).json(data);
        } else {
            // Si n8n devuelve texto (como "Workflow started"), lo convertimos a JSON
            const textData = await response.text();
            return res.status(200).json({ resumen: textData });
        }

    } catch (error) {
        return res.status(500).json({ error: "Error de conexión", message: error.message });
    }
}
