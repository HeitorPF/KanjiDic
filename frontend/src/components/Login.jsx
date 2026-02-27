import { useState } from "react"
import './Login.css'

export function Login() {

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value 
    });
  }

  return (
    <div className='login'>
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
          />
          <button
            className="password-hide material-symbols-outlined"
            onClick={() => { setIsPasswordVisible(!isPasswordVisible) }}
          >
            {isPasswordVisible ? 'visibility' : 'visibility_off'}
          </button>
        </div>
      </div>

      <div className='login-buttons'>
        <button
          className="form-btn"
          type="submit"
          value='Log In'
        >
          Login
          <span className="material-symbols-outlined">
            login
          </span>
        </button>
        <button
          className="form-btn"
          onClick={() => { console.log(user) }}
        >
          Create Account
          <span className="material-symbols-outlined">
            person_add
          </span>
        </button>
      </div>
    </div>
  )
}