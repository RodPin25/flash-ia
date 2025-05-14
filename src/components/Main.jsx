// src/components/FlashcardUploader.jsx
import { useState } from "react";
import axios from "axios";
import './Main.css';

function FlashcardUploader() {
  const [archivo, setArchivo] = useState(null);
  const [url, setUrl] = useState("");
  const [flashcards, setFlashcards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    console.log("Archivo seleccionado:", e.target.files[0]); // Log al seleccionar el archivo
    setArchivo(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!archivo) {
      console.log("No se ha seleccionado ningún archivo."); // Log si no hay archivo
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result ? reader.result.split(',')[1] : null;
      console.log("Resultado de FileReader:", reader.result ? reader.result.substring(0, 50) + "..." : null); // Log del resultado del FileReader
      console.log("Base64 generado:", base64 ? base64.substring(0, 50) + "..." : null); // Log del inicio del Base64

      setLoading(true);
      setError("");

      try {
        console.log("Enviando petición POST a:", "https://flashcardsia-production.up.railway.app/process-document"); // Log antes de la petición
        console.log("Base64 completo:", reader.result);
        const response = await axios.post("https://flashcardsia-production.up.railway.app/process-document", {
          archivo_base64: base64,
          nombre: archivo.name,
        });
        console.log("Respuesta del servidor:", response.data); // Log de la respuesta exitosa
        setFlashcards(response.data);
      } catch (err) {
        console.error("Error en la petición:", err); // Log del error completo
        setError("Error al procesar el archivo");
      } finally {
        setLoading(false);
        console.log("Petición finalizada, loading:", loading); // Log al finalizar la petición
      }
    };
    console.log("Iniciando lectura del archivo como Data URL."); // Log antes de iniciar la lectura
    reader.readAsDataURL(archivo);
  };

  const handleProcessUrl = async () => {
    if (!url) {
      console.log("No se ha ingresado ninguna URL."); // Log si no hay URL
      return;
    }
    setLoading(true);
    setError("");

    try {
      console.log("Enviando petición POST a:", "https://flashcardsia-production.up.railway.app/process-url", { url }); // Log antes de la petición de URL
      const response = await axios.post("https://flashcardsia-production.up.railway.app/process-url", { url });
      console.log("Respuesta del servidor (URL):", response.data); // Log de la respuesta exitosa de la URL
      setFlashcards(response.data);
    } catch (err) {
      console.error("Error en la petición de URL:", err); // Log del error de la URL
      setError("Error al procesar la URL");
    } finally {
      setLoading(false);
      console.log("Petición de URL finalizada, loading:", loading); // Log al finalizar la petición de URL
    }
  };

  return (
    <div className="main-container">
      <h1>Generador de Flashcards</h1>

      <div className="input-group">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUploadFile}>Subir archivo</button>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Ingresa un enlace"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleProcessUrl}>Procesar enlace</button>
      </div>

      {loading && <p className="status-message loading">Procesando...</p>}
      {error && <p className="status-message error">{error}</p>}

      {flashcards && (
        <div className="flashcards">
          <h2>Flashcards generadas</h2>
          <ul>
            {flashcards.preguntas.map((pregunta, idx) => (
              <li key={idx}>
                <strong>Q:</strong> {pregunta}<br />
                <strong>A:</strong> {flashcards.respuestas[idx]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FlashcardUploader;