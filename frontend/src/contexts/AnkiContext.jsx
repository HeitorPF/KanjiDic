import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router';

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
      <Modal isOpen={ismodalOpen} onClose={() => {navigate('/'); setIsModalOpen(false)}}>
        <div className="modal-error-content">
          <h3>⚠️ Anki Disconnected</h3>
          <p>Please open the Anki app on your computer to configure your cards.</p>

          <button>Try Again</button>
        </div>
      </Modal>
    </AnkiContext.Provider>
  );
}