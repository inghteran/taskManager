import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

interface Tarea {
  id: number;
  titulo: string;
}

const tareas: Tarea[] = [];

// Endpoint CORREGIDO: Rechaza títulos vacíos o compuestos solo por espacios
app.post('/tareas', (req: Request, res: Response) => {
  const { titulo } = req.body;

  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const nuevaTarea = { id: Date.now(), titulo: titulo.trim() };
  tareas.push(nuevaTarea);
  return res.status(201).json(nuevaTarea);
});

export default app;