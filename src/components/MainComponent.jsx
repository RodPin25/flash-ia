// src/components/FlashcardUploader.jsx
import { useState } from "react";
import axios from "axios";

function FlashcardUploader() {
  const [archivo, setArchivo] = useState(null);
  const [url, setUrl] = useState("");
  const [flashcards, setFlashcards] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUploadFile = async () => {
    if (!archivo) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      setLoading(true);
      setError("");

      try {
        const response = await axios.post("http://localhost:3000/process-document", {
          archivo_base64: base64,
          nombre: archivo.name,
        });
        setFlashcards(response.data);
      } catch (err) {
        setError("Error al procesar el archivo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(archivo);
  };

  const handleProcessUrl = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/process-url", { url });
      setFlashcards(response.data);
    } catch (err) {
      setError("Error al procesar la URL");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador de Flashcards</h1>

      <div className="mb-4">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUploadFile} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Subir archivo
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Ingresa un enlace"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-3/4"
        />
        <button onClick={handleProcessUrl} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
          Procesar enlace
        </button>
      </div>

      {loading && <p>Procesando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {flashcards && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Flashcards generadas</h2>
          <ul className="list-disc pl-5">
            {flashcards.preguntas.map((pregunta, idx) => (
              <li key={idx} className="mb-2">
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
