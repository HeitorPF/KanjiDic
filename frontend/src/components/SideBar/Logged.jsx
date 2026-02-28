import { useContext } from "react";
import { AnkiConnect } from "../AnkiConnect";
import { UserContext } from "../../contexts/UserContext";


export function Logged() {
  const { user } = useContext(UserContext)

  return (
    <>
      <p>Olá, {user.name}</p>

      <AnkiConnect />
    </>

  )
}