// 1. Le decimos a TypeScript qué datos necesita este componente para existir
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type TaskCardProps = {
  task: Task;                             // La tarea individual que va a dibujar
  onDeleteTask: (id: number) => void;     // La función para avisar que quieren borrar
  onToggleTask: (id: number) => void;     // La función para avisar que quieren tachar
};

function TaskCard({ task, onDeleteTask, onToggleTask }: TaskCardProps) {
  return (
    // Si la tarea está completada, el CSS le aplicará opacidad y una línea encima
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      
      {/* SECCIÓN IZQUIERDA: Checkbox + Texto */}
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed} // Si está en true en la memoria, aparecerá marcado
          onChange={() => onToggleTask(task.id)} // Al hacer clic, ejecuta la función del padre
        />
        {/* Aquí imprimimos de forma dinámica el texto usando llaves {} */}
        <span className="task-text">{task.text}</span>
      </div>

      {/* SECCIÓN DERECHA: Botón de eliminar */}
      <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
        Eliminar
      </button>

    </div>
  );
}

export default TaskCard;