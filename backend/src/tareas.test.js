"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("./app"));
(0, vitest_1.describe)('API de Tareas - Cacería de Bugs', () => {
    (0, vitest_1.it)('rechaza crear una tarea con título vacío o solo espacios', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/tareas')
            .send({ titulo: '   ' });
        // La prueba exige 400 Bad Request
        (0, vitest_1.expect)(res.status).toBe(400);
    });
});
//# sourceMappingURL=tareas.test.js.map