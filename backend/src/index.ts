const express = require("express");
const cors = require("cors");
// PRISMA CHANGE: Import Prisma Client
const { PrismaClient } = require("@prisma/client");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

app.use(cors()); // Habilitamos CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Habilitamos el parseo de JSON en las solicitudes entrantes

// PRISMA CHANGE: Create the connection to PostgreSQL through Prisma
const prisma = new PrismaClient();

//app.use(express.json());
/*
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// This array is still here because POST, PUT, and DELETE are not connected to Prisma yet.
// PRISMA CHANGE: GET /tasks will no longer use this array.
let tasks: Task[] = [
  { id: 1, text: "Estudiar Node.js", completed: false },
  { id: 2, text: "Crear servidor Express", completed: true },
  { id: 3, text: "Probar rutas del backend", completed: false }
];
*/

/*
app.post("/login", (req: any, res: any) => {
    const { email, password } = req.body || {};
    if (email === "admin@test.com" && password === "123456") {
        // JWT: If the credentials are correct, we create a token.
        const token = jwt.sign(
            // JWT: This is the information stored inside the token.
            { email: email },
            // JWT: This secret is used to sign the token.
            "secret_key",
            // JWT: The token will expire in 1 hour.
            { expiresIn: "1h" }
        );
        return res.json({
            message: "Login successful",
            token: token
        });
    }
    res.status(401).json({
        message: "Invalid credentials"
    });
});
*/


// AUTH: Login now checks real users from PostgreSQL.
// AUTH: bcrypt.compare checks the typed password against the saved hash.
app.post("/login", async (req: any, res: any) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    const user = await prisma.user.findUnique({
        where: { email: email }
    });
    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    const token = jwt.sign(
        { id: user.id, email: user.email },
        "secret_key",
        { expiresIn: "1h" }
    );
    res.json({
        message: "Login successful",
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});




// 5. Crear ruta POST /register - ¡AQUÍ LO PEGAS!
app.post("/register", async (req: any, res: any) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  // PRISMA: Busca si el usuario ya existe en la base de datos
  const existingUser = await prisma.user.findUnique({
    where: { email: email }
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  // BCRYPTJS: Encriptamos la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);

  // PRISMA: Crea el nuevo registro en PostgreSQL
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword
    }
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});




// NEW JWT CHANGE: This is a protected route.
// NEW JWT CHANGE: The user must send a valid token to access this route.
app.get("/profile", (req: any, res: any) => {
    // NEW JWT CHANGE: The token is expected in the Authorization header.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    // NEW JWT CHANGE: The header usually looks like "Bearer token_here".
    // NEW JWT CHANGE: We split it and take only the token part.
    const token = authHeader.split(" ")[1];
    try {
        // NEW JWT CHANGE: jwt.verify checks if the token is valid.
        const decoded = jwt.verify(token, "secret_key");
        res.json({
            message: "Protected profile data",
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
});


app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

// PRISMA CHANGE: GET /tasks now reads from PostgreSQL instead of the array
app.get("/tasks", async (req: any, res: any) => {
  const tasksFromDatabase = await prisma.task.findMany();
  res.json(tasksFromDatabase);
});

/// metodo anterior
/*
app.post("/tasks", (req: any, res: any) => {
  const { text } = req.body || {};

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }

  const newTask: Task = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
*/

// 2. POST /tasks - Crea una nueva tarea directamente en PostgreSQL
app.post("/tasks", async (req: any, res: any) => {
  const { text } = req.body || {};

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }

  // PRISMA: Reemplazamos el .push() por un .create()
  const newTask = await prisma.task.create({
    data: {
      text: text,
      completed: false
    }
  });

  res.status(201).json(newTask);
});

// 3. PUT /tasks/:id - Cambia el estado de completado en PostgreSQL
app.put("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  // Primero buscamos la tarea para saber cuál es su estado 'completed' actual
  const task = await prisma.task.findUnique({
    where: { id: id }
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // PRISMA: Actualizamos la tarea invirtiendo el valor de 'completed'
  const updatedTask = await prisma.task.update({
    where: { id: id },
    data: { completed: !task.completed }
  });

  res.json(updatedTask);
});

// 4. DELETE /tasks/:id - Elimina de forma permanente la tarea de PostgreSQL
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);

  try {
    // PRISMA: Intentamos borrar directamente usando el ID
    await prisma.task.delete({
      where: { id: id }
    });
    res.status(204).send();
  } catch (error) {
    // Si Prisma no encuentra el ID, lanzará un error que atrapamos aquí
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



/// remplazamos el metodo anterior
/*
app.put("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.completed = !task.completed;
  res.json(task);
});

app.delete("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/