import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",

    // O tsconfig do projeto usa "module": "esnext" (para o tsx/dev),
    // mas o Jest roda em CommonJS. Sobrescrevemos só para o transform dos testes.
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: {
                    module: "commonjs",
                    moduleResolution: "node",
                },
            },
        ],
    },

    // Espelha o alias "@/*" -> "src/*" definido no tsconfig.json
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    // Onde o Jest procura os testes
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],

    // Testes *.container.test.ts sobem um Postgres real via Testcontainers
    // (exigem Docker e são lentos) — ficam fora do `npm test` padrão,
    // rodam só via `npm run test:integration`.
    testPathIgnorePatterns: ["/node_modules/", "\\.container\\.test\\.ts$"],

    clearMocks: true,

    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.entity.ts",
        "!src/app.ts",
        "!src/env/**",
    ],
};

export default config;
