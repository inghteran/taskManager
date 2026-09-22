import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from './app';

describe('API de Tareas - Cacería de Bugs', () => {
  it('rechaza crear una tarea con título vacío o solo espacios', async () => {
    const res = await request(app)
      .post('/tareas')
      .send({ titulo: '   ' });

    // La prueba exige 400 Bad Request
    expect(res.status).toBe(400);
  });
});