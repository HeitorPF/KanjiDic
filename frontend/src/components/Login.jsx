import { useState } from "react"
import './Login.css'

export function Login() {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })

  function handleChange(event) {
    const { name, value } = event.target; // Descobre QUEM o usuário digitou e O QUE ele digitou

    setUser({
      ...user, // Copia tudo que já estava preenchido antes
      [name]: value  // Atualiza apenas o campo específico com o valor novo
    });
  }

  return (
    <div className='logar'>

      <h2 className="login-title">Login</h2>

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
        />
      </div>

      <div className='password-form'>
        <label
          className="password-label"
          htmlFor="password"
        >Password:</label>
        <div className='password-input-container'>
          <input
            className="password-input"
            type="password"
            id="password"
            name="password"
            placeholder="Your password.."
            onChange={handleChange}
          />
          <button
            className="password-hide"
          >
            O
          </button>
        </div>
      </div>

      <div className='login-buttons'>
        <input
          className="form-btn"
          type="submit"
          value='Log In'
        />
        <button
          className="form-btn"
          onClick={() => { console.log(user) }}
        >
          Create Account
        </button>
      </div>

    </div>
  )
}