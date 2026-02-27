import { useState } from "react"
import axios from "axios";
import './Form.css'

export function FormRegister({ user, setUser, setScreen }) {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value
    });
  }

  async function register() {
    try {
      const resposta = await axios.post('http://localhost:3001/api/register', { name: user.name, email: user.email, password: user.password })

      const dados = resposta.data
      console.log(dados)
    }catch(e){
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
          value={user.name}
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