import axios from 'axios'
import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import './AnkiConnect.css'

export function AnkiConnect() {

  const [isAnkiOpen, setIsAnkiOpen] = useState(false)

  useEffect(() => {
    if (!isAnkiOpen) connectToAnki()
  }, [])

  async function connectToAnki() {
    try {
      const permissionResponse = await ankiConnect('requestPermission', 6);
      if (permissionResponse.permission === 'granted') {
        setIsAnkiOpen(true);
      } else {
        setIsAnkiOpen(false);
      }
    } catch (error) {
      console.warn("Anki não detectado. Abra o aplicativo para sincronizar.", error);
      setIsAnkiOpen(false);
    }
  }

  async function ankiConnect(action, version, params = {}) {
    try {
      const response = await axios.post('http://127.0.0.1:8765', {
        action,
        version,
        params
      });
      const data = response.data;

      if (data.error) {
        throw data.error;
      }

      if (data.result) {
        return data.result;
      } else {
        throw new Error('failed to get results from AnkiConnect');
      }
    } catch (e) {
      if (e.isAxiosError) {
        throw new Error('failed to connect to AnkiConnect');
      }
      throw e;
    }
  }

  return (
    <>
      {isAnkiOpen
        ? (
          <Link
            className='anki-connect connected'
            to='/ankiSettings'>
            Configure Anki
          </ Link>
        ) : (
          <div
            className='anki-connect'
            onClick={connectToAnki}>
            Conect to Anki
          </div>
        )}

    </>

  )
}