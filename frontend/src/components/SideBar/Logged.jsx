import { useContext } from "react";
import { AnkiConnect } from "../AnkiConnect";
import { UserContext } from "../../contexts/UserContext";
import './Logged.css'

export function Logged() {
  const { user, logout } = useContext(UserContext)

  return (
    <>

      <div className="logged">
        <p className="welcome-user">Hello, {user.name}!</p>

        <AnkiConnect />

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