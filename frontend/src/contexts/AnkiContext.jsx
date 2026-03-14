import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router';
import { TriangleAlert } from 'lucide-react'

// eslint-disable-next-line react-refresh/only-export-components
export const AnkiContext = createContext();

export function AnkiProvider({ children }) {
  const [ismodalOpen, setIsModalOpen] = useState(false)

  const navigate = useNavigate()

  async function fetchAnkiData(action, version, params = {}) {
    try {
      const response = await axios.post('http://127.0.0.1:8765', {
        action: action,
        version: version,
        params: params
      });
      setIsModalOpen(false)
      return response.data.result
    } catch (err) {
      console.error("Error connecting to AnkiConnect:", err);
      setIsModalOpen(true)
      throw null;
    }
  }

  return (
    <AnkiContext.Provider value={{ fetchAnkiData }}>
      {children}
      <Modal isOpen={ismodalOpen} onClose={() => { navigate('/'); setIsModalOpen(false) }}>
        <div className="modal-error-content">
          <h3><TriangleAlert color="#ffff00" /> Anki Disconnected</h3>
          <p>Please open the Anki app on your computer to configure your cards.</p>
        </div>
      </Modal>
    </AnkiContext.Provider>
  );
}