import { useState, useContext } from "react"
import { UserContext } from "../../contexts/UserContext";
import { Eye, EyeOff, LogIn } from 'lucide-react'
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
            className="password-hide"
            onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            {isPasswordVisible ? <Eye size={24}/> : <EyeOff size={24}/>}
          </button>
        </div>
      </div>

      <button
        className="form-btn"
        type="submit"
        onClick={() => { login(formData.email, formData.password) }}
      >
        Login
        <LogIn />
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