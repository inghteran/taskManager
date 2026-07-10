import React, { useState, useEffect } from "react";

export default function Bienvenida({ onLogin }: { onLogin: () => void }) {
  // Estados para el Registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Estados para el Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados globales de control
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(""); 
  const [profileData, setProfileData] = useState<any>(null);

  // 🔄 REQUISITO PUNTO 10: Al cargar el componente, revisamos si ya había un token guardado
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    if (tokenGuardado) {
      setToken(tokenGuardado);
      setMessage("Se recuperó un token activo desde el LocalStorage.");
    }
  }, []);

  // Función para /register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`¡Usuario registrado! ID: ${data.user.id}`);
        setRegName(""); setRegEmail(""); setRegPassword("");
      } else { setMessage(`Error: ${data.message}`); }
    } catch (error) { setMessage("No se pudo conectar con el servidor."); }
  };

  // Función para /login modificada para el Punto 10
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        // 💾 PUNTO 10: Guardamos el token en localStorage del navegador
        localStorage.setItem("token", data.token); 
        
        // También lo dejamos en el estado para que React reaccione visualmente
        setToken(data.token); 
        setMessage("¡Sesión iniciada! Token guardado en LocalStorage.");
        setLoginEmail(""); setLoginPassword("");
      } else { setMessage(`Error en login: ${data.message}`); }
    } catch (error) { setMessage("Error al conectar con el login."); }
  };

  // Función para consumir /profile usando el token (Punto 10 seguro)
  const handleFetchProfile = async () => {
    setMessage("");
    setProfileData(null);

    // 🔑 PUNTO 10: Traemos el token directamente desde localStorage para asegurar el flujo
    const tokenDesdeStorage = localStorage.getItem("token");

    if (!tokenDesdeStorage) {
      setMessage("No hay ningún token guardado en el navegador.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          // Enviamos el token en la cabecera Authorization tal como pide la guía
          "Authorization": `Bearer ${tokenDesdeStorage}` 
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(data);
        setMessage("Datos del perfil obtenidos usando el token de LocalStorage.");
      } else {
        setMessage(`Error al obtener perfil: ${data.message}`);
      }
    } catch (error) {
      setMessage("Error al conectar con el endpoint de perfil.");
    }
  };

  // 🚪 Función extra para poder limpiar el token y probar el flujo de nuevo
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProfileData(null);
    setMessage("Sesión cerrada. Token eliminado de LocalStorage.");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto", color: "#fff" }}>
      <h2>Práctica de Autenticación (Punto 10)</h2>
      
      {/* FORMULARIO DE REGISTRO */}
      <div style={{ border: "1px solid #444", padding: "15px", marginBottom: "20px", borderRadius: "5px", background: "#222" }}>
        <h3>Formulario de Registro</h3>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "10px" }}>
            <label>Nombre: </label>
            <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required style={{ width: "100%", padding: "5px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email: </label>
            <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required style={{ width: "100%", padding: "5px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Contraseña: </label>
            <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required style={{ width: "100%", padding: "5px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <button type="submit" style={{ padding: "8px 12px", cursor: "pointer", background: "#28a745", color: "white", border: "none", borderRadius: "4px" }}>Registrar Usuario</button>
        </form>
      </div>

      {/* FORMULARIO DE LOGIN */}
      <div style={{ border: "1px solid #444", padding: "15px", marginBottom: "20px", borderRadius: "5px", background: "#222" }}>
        <h3>Formulario de Login</h3>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <label>Email: </label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ width: "100%", padding: "5px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Contraseña: </label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ width: "100%", padding: "5px", background: "#333", color: "#fff", border: "1px solid #555" }} />
          </div>
          <button type="submit" style={{ padding: "8px 12px", cursor: "pointer", background: "#007acc", color: "white", border: "none", borderRadius: "4px" }}>Iniciar Sesión</button>
        </form>
      </div>

      {/* ÁREA PROTEGIDA */}
      {token && (
        <div style={{ border: "1px solid #ffc107", padding: "15px", marginBottom: "20px", borderRadius: "5px", background: "#2b2301" }}>
          <h3>Área Protegida</h3>
          <p>Hay un token guardado en el navegador de forma persistente.</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={handleFetchProfile}
              style={{ padding: "10px 15px", cursor: "pointer", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold" }}
            >
              🔍 Probar ruta protegida /profile
            </button>
            <button 
              onClick={handleLogout}
              style={{ padding: "10px 15px", cursor: "pointer", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>

          {profileData && (
            <div style={{ marginTop: "15px", padding: "10px", background: "#111", border: "1px solid #555", borderRadius: "4px" }}>
              <h4>Datos Recibidos:</h4>
              <p><strong>Mensaje:</strong> {profileData.message}</p>
              <p><strong>Email del Token:</strong> {profileData.user?.email}</p>
            </div>
          )}
        </div>
      )}

      {/* Caja global de mensajes */}
      {message && (
        <div style={{ padding: "10px", background: "#333", borderLeft: "4px solid #007acc", marginBottom: "20px" }}>
          <strong>Estado:</strong> {message}
        </div>
      )}
    </div>
  );
}