import {useState} from "react";

type TaskInputProps = {
    onAddTask: (taskText: string) => void;
};

function TaskInput(props: TaskInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (text.trim() === "") {
            return;
        }

        props.onAddTask(text);
        setText("");
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Escribir una nueva tarea"
                value={text}
                onChange={(event) => setText(event.target.value)}
            />
            <button onClick={handleSubmit}>
                Agregar
            </button>
        </div>
    );
}   

export default TaskInput;