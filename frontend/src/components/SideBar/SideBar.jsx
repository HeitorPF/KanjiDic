import { useState } from "react"
import { FormLogin } from './FormLogin'
import { FormRegister } from './FormRegister'
import { Logged } from "./Logged"

export function SideBar({ sideBar }) {

  const [screen, setScreen] = useState('logged')

  function renderScreen() {
    switch (screen) {
      case 'logged':
        return (
          <>
            <Logged />
          </>
        )

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