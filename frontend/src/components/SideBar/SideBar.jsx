import { useState, useContext } from "react"
import { FormLogin } from './FormLogin'
import { FormRegister } from './FormRegister'
import { UserContext } from "../../contexts/UserContext"
import { Logged } from "./Logged"

export function SideBar({ sideBar }) {

  const { user } = useContext(UserContext)

  const [screen, setScreen] = useState('login')

  function renderScreen() {
    if (user)
      return (
        <>
          <Logged />
        </>
      )
    switch (screen) {
      case 'login':
        return (
          <FormLogin
            setScreen={setScreen}
          />
        )
      case 'register':
        return (
          <FormRegister
            setScreen={setScreen}
          />
        )

      default:
        return (
          <Login
            setScreen={setScreen}
          />
        )
    }
  }

  return (
    <div className={`side-bar ${sideBar ? `open` : ''}`}>
      <div className={`side-bar-content ${sideBar ? 'side-bar-content-visible' : ''}`}>
        {renderScreen()}
      </div>

    </div>
  )
}