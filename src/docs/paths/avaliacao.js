import commonResponses from "../schemas/swaggerCommonResponses.js";

const avaliacaoRoutes = {
    "/avaliacoes/restaurante/{restauranteId}": {
        get: {
            tags: ["Avaliações"],
            summary: "Lista avaliações de um restaurante",
            description: `
        + Caso de uso: Permitir que qualquer usuário consulte as avaliações de um restaurante.
        
        + Função de Negócio:
            - Permitir ao front-end obter a lista de avaliações com notas e comentários.
            + Recebe como path parameter:
                - **restauranteId**: identificador do restaurante (MongoDB ObjectId).

        + Regras de Negócio:
            - Rota pública (não requer autenticação).
            - Suporte a paginação via parâmetros page e limite.
            - Ordenadas por data de criação (mais recente primeiro).
            - Retorna dados do cliente (nome) e do pedido associado.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **AvaliacaoListagem**.
      `,
            parameters: [
                { name: "restauranteId", in: "path", required: true, schema: { type: "string" }, description: "ID do restaurante" },
                { name: "limite", in: "query", schema: { type: "number" }, required: false, description: "Registros por página" },
                { name: "page", in: "query", schema: { type: "number" }, required: false, description: "Número da página" }
            ],
            responses: {
                200: commonResponses[200]("#/components/schemas/AvaliacaoListagem"),
                400: commonResponses[400](),
                404: commonResponses[404](),
                500: commonResponses[500]()
            }
        }
    },
}