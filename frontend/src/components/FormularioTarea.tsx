import React, { useState } from 'react';

interface Props {
  onAgregar: (titulo: string) => void;
}

export default function FormularioTarea({ onAgregar }: Props) {
  const [titulo, setTitulo] = useState('');

  function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    if (titulo.trim()) {
      onAgregar(titulo);
      setTitulo('');
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <label htmlFor="titulo-tarea">Nueva tarea</label>
      <input
        id="titulo-tarea"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}