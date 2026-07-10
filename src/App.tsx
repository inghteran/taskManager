// 1. Importamos useEffect junto a useState
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import Bienvenida from "./components/Bienvenida"; 

type Task = {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string; 
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // 🛡️ ESTADO DE SEGURIDAD: Reemplazamos el menú por un verdadero candado
  const [isLogged, setIsLogged] = useState(false);

  // 1. Al iniciar la app, el "guardia" verifica si ya hay un token válido guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogged(true); // ¡Pase libre, ya estaba logueado!
    }
  }, []);

  // 2. CARGAR TAREAS (¡Ahora solo las busca si el usuario tiene permiso!)
  useEffect(() => {
    if (!isLogged) return; // Si no está logueado, detenemos la función aquí

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };
    fetchTasks();
  }, [isLogged]); // Este useEffect se vuelve a disparar en cuanto isLogged cambia a true

  // --- TUS FUNCIONES DEL GESTOR (Se quedan exactamente igual) ---
  const addTask = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const deleteTask = (id: number) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar");
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => console.error("Error:", error));
  };

  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) return { ...task, completed: !task.completed };
      return task;
    });
    setTasks(updatedTasks);
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  // 3. FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("token"); // Borramos la credencial
    setIsLogged(false);               // Ponemos el candado
    setTasks([]);                     // Borramos las tareas de la pantalla por seguridad
  };


  // RENDERIZADO CONDICIONAL ESTRICTO (El Bloqueo)

  // Si NO está logueado, mostramos el login (Y le pasamos la llave para abrir el candado)
  if (!isLogged) {
    return (
      <div className="app-container">
        {/* Aquí conectamos el evento onLogin que programaste en el paso anterior */}
        <Bienvenida onLogin={() => setIsLogged(true)} />
      </div>
    );
  }

  // Si SÍ está logueado, le mostramos su Gestor de Tareas y el botón de Salir
  return (
    <div className="app-container">
      {/* Barra superior de sesión */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
        <button 
          onClick={handleLogout}
          style={{ padding: "8px 15px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      <Header />
      <TaskInput onAddTask={addTask} />
      <TaskList 
        tasks={tasks} 
        onDeleteTask={deleteTask} 
        onToggleTask={toggleTask} 
      />
      <Footer 
        total={tasks.length} 
        completed={completedTasks} 
        pending={pendingTasks} 
      />
    </div>
  );
}

export default App;