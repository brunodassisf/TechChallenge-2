import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TechChallenge v2 API",
            version: "1.0.0",
            description: "API de desenvolvimento para o TechChallenge v2",
        },
        servers: [{ url: "http://localhost:3000" }],
        tags: [
            { name: "Authors", description: "Cadastro e consulta de autores" },
            { name: "Posts", description: "Cadastro, consulta, atualização e remoção de posts" },
        ],
        components: {
            schemas: {
                Author: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                    },
                },
                Post: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        content: { type: "string" },
                        author: { $ref: "#/components/schemas/Author" },
                    },
                },
            },
        },
    },
    // onde procurar os comentários @openapi/@swagger
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
