import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Link } from 'react-router'
import { User, Settings, LogOut } from 'lucide-react'
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
            <User />
            Account
          </Link>

          {/* Anki Settings */}
          <Link
            className='login-options'
            to='/ankiSettings'
          >
            <Settings />
            Configure Anki
          </ Link>

        </div>



        {/* Logout */}
        <button
          onClick={logout}
          className="login-options logout"
        >
          <LogOut />
          Logout
        </button>
      </div>


    </>

  )
}