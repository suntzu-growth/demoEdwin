export default async function handler(req, res) {
    const N8N_URL = process.env.N8N_WEBHOOK_URL;

    // 1. Verificar si la variable existe
    if (!N8N_URL) {
        return res.status(500).json({ 
            error: "Configuración incompleta", 
            detail: "La variable N8N_WEBHOOK_URL no está definida en Vercel." 
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const response = await fetch(N8N_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(req.body),
        });

        // 2. Verificar si n8n respondió bien (200-299)
        if (!response.ok) {
            const errorBody = await response.text();
            return res.status(response.status).json({ 
                error: "n8n respondió con error", 
                detail: errorBody 
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        // 3. Capturar errores de conexión
        return res.status(500).json({ 
            error: "Error de conexión", 
            message: error.message 
        });
    }
}
