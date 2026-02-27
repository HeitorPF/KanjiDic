import { useState } from "react"
import './Form.css'
import axios from "axios";

export function FormLogin({ user, setUser, setScreen }) {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value
    });
  }

  async function login() {
    try {
      const resposta = await axios.post('http://localhost:3001/api/login', { email: user.email, password: user.password })
      const dados = resposta.data
      console.log(dados)
    } catch (e) {
      alert(`${e.response.data.message}`)
    }
  }

  return (
    <div className='form'>
      <h2 className="form-title" onClick={() => { console.log(user) }}>Login</h2>

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
          value={user.email}
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
            value={user.password}
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
        onClick={login}
      >
        Login
        <span className="material-symbols-outlined">
          login
        </span>
      </button>

      <div className="form-link">
        Don't have an account yet?
        <button
          className="form-link-btn"
          onClick={() => { setScreen('register') }}
        >
          Register!
        </button>
      </div>
    </div>
  )
}