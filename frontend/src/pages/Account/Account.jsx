import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext"
import axios from "axios";
import './Account.css'

export function Account() {
  const { user, logout } = useContext(UserContext)
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const VITE_API_URL = import.meta.env.VITE_API_URL

  async function changePassword() {


    console.log(password.newPassword, password.confirmPassword)
    if (password.newPassword !== password.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }
    else {
      try {
        const token = localStorage.getItem('kanjidic_token')
        console.log(token)
        const response = await axios.patch(`${VITE_API_URL}/api/changePassword`, {
          oldPassword: password.oldPassword,
          newPassword: password.newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        alert(response.data.message)
      } catch (error) {
        console.error(error)
        alert('Error changing password')
      }

    }
  }

  async function deleteAccount() {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('kanjidic_token')
        const response = await axios.delete(`${VITE_API_URL}/api/deleteAccount`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        alert(response.data.message)
        logout()
      } catch (error) {
        console.error(error)
        alert('Error deleting account')
      }
    }
  }

  return (
    <>
      <div className="account-page">
        <h2>Account Information</h2>
        <div className="account-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <div className="change-password-container">
            <h3>Change Password</h3>
            <label htmlFor="old-password">Type your current password:</label>
            <input type="password" id="old-password" value={password.oldPassword} onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} />
            <label htmlFor="new-password">Type your new password:</label>
            <input type="password" id="new-password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
            <label htmlFor="confirm-password">Confirm your new password:</label>
            <input
              type="password"
              id="confirm-password"
              value={password.confirmPassword}
              onChange={(e) => setPassword({
                ...password,
                confirmPassword: e.target.value
              })}
            />
            <button className="change-password-btn" onClick={changePassword}>
              Change password
            </button>
          </div>
          <button onClick={deleteAccount}>Delete account</button>
        </div>
      </div>
    </>
  )
}