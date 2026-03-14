import { useState, useContext } from "react"
import { UserContext } from "../../contexts/UserContext";
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import './Form.css'

export function FormRegister({ setScreen }) {

  const { register } = useContext(UserContext)
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
            className="password-hide"
            onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            {isPasswordVisible ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>
      </div>

      <button
        className="form-btn"
        type="submit"
        onClick={() => register(formData.name, formData.email, formData.password)}
      >
        Register
        <UserPlus />
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