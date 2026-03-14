import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Link } from 'react-router'
import './Logged.css'

export function Logged() {
  const { user, logout } = useContext(UserContext)

  return (
    <>

      <div className="logged">
        <p className="welcome-user">Hello, {user.name}!</p>

        <div className="logged-options">

          {/* Account} */}
          <Link
            className='login-options'
            to='/account'
          >
            <span className="material-symbols-outlined">
              person
            </span>
            Account
          </Link>

          {/* Anki Settings */}
          <Link
            className='login-options'
            to='/ankiSettings'
          >
            <span className='material-symbols-outlined settings-icon'>
              settings
            </span>
            Configure Anki
          </ Link>

        </div>



        {/* Logout */}
        <button
          onClick={logout}
          className="login-options logout"
        >
          <span className="material-symbols-outlined">
            logout
          </span>
          Logout
        </button>
      </div>


    </>

  )
}