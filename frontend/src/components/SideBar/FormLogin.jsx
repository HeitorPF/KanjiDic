import { useState, useContext } from "react"
import { UserContext } from "../../contexts/UserContext";
import './Form.css'

export function FormLogin({ setScreen }) {
  
  const { login } = useContext(UserContext)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <div className='form'>
      <h2 className="form-title">Login</h2>

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
        onClick={() => { login(formData.email, formData.password) }}
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