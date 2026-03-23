const avaliacaoSchemas = {
    AvaliacaoListagem: {
        type: "object",
        properties: {
            _id: { type: "string", example: "674fa21d79969d2172e78740" },
            pedido_id: { type: "string", example: "674fa21d79969d2172e78730" },
            cliente_id: { type: "string", example: "674fa21d79969d2172e78710" },
            restaurante_id: { type: "string", example: "674fa21d79969d2172e78711" },
            nota: { type: "number", minimum: 1, maximum: 5, example: 5 },
            descricao: { type: "string", example: "Excelente! Comida deliciosa e entrega rápida." },
            createdAt: { type: "string", format: "date-time", example: "16/01/2025 12:00:00" },
            updatedAt: { type: "string", format: "date-time", example: "16/01/2025 12:00:00" }
        },
        description: "Schema para listagem de avaliações"
    },

    AvaliacaoDetalhes: {
        type: "object",
        properties: {
            _id: { type: "string", example: "674fa21d79969d2172e78740" },
            pedido_id: { type: "string", example: "674fa21d79969d2172e78730" },
            cliente_id: { type: "string", example: "674fa21d79969d2172e78710" },
            restaurante_id: { type: "string", example: "674fa21d79969d2172e78711" },
            nota: { type: "number", minimum: 1, maximum: 5, example: 5 },
            descricao: { type: "string", example: "Excelente! Comida deliciosa e entrega rápida." },
            createdAt: { type: "string", format: "date-time", example: "16/01/2025 12:00:00" },
            updatedAt: { type: "string", format: "date-time", example: "16/01/2025 12:00:00" }
        },
        description: "Schema para detalhes de uma avaliação"
    },
}