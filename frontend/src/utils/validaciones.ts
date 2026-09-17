export function esCorreoValido(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

export function contarTareasPendientes(tareas: Array<{ completada: boolean }>): number {
  if (!Array.isArray(tareas)) return 0;
  return tareas.filter((t) => !t.completada).length;
}