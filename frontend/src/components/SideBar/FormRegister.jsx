import axios from "axios";
import { useState, useContext } from "react"
import { UserContext } from "../../contexts/UserContext";
import './Form.css'

export function FormRegister({ setScreen }) {

  const { setUser } = useContext(UserContext)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })

  const VITE_API_URL = import.meta.env.VITE_API_URL

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function register() {
    try {
      const resposta = await axios.post(`${VITE_API_URL}/api/register`, { name: formData.name, email: formData.email, password: formData.password })

      const dados = resposta.data
      setUser(dados.data)
    } catch (e) {
      alert(`${e.response.data.message}`)
    }
  }

  return (
    <div className='form'>
      <h2 className="form-title">Register</h2>

      <div className='name-form'>
        <label
          className="name-label"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          className='name-input'
          type="text"
          id="name"
          name="name"
          placeholder="Your name..."
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      <div className='email-form'>
        <label
          className="email-label"
          htmlFor="email"
        >
          Email:
        </label>
        <input
          className='email-input'
          type="email"
          id="email"
          name="email"
          placeholder="Your email..."
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      <div className='password-form'>
        <label
          className="password-label"
          htmlFor="password"
        >
          Password:
        </label>

        <div className='password-input-container'>
          <input
            className="password-input"
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Your password..."
            onChange={handleChange}
            value={formData.password}
          />
          <button
            className="password-hide material-symbols-outlined"
            onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            {isPasswordVisible ? 'visibility' : 'visibility_off'}
          </button>
        </div>
      </div>

      <button
        className="form-btn"
        type="submit"
        onClick={register}
      >
        Register
        <span className="material-symbols-outlined">
          person_add
        </span>
      </button>

      <div className="form-link">
        Already have an account?
        <button
          className="form-link-btn"
          onClick={() => { setScreen('login') }}
        >
          Sign in!
        </button>
      </div>
    </div>
  )
}