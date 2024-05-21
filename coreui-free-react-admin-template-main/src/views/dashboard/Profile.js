import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CContainer,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'

const Profile = () => {
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUserInfo(storedToken)
    }
  }, [])

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:9091/userinfo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setUsername(response.data.username)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:9091/register', {
        username: registerUsername,
        password: registerPassword,
      })
      setMessage('User registered successfully')
      setRegisterUsername('')
      setRegisterPassword('')
      setShowRegisterForm(false)
    } catch (error) {
      setMessage('Error registering user: ' + error.message)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:9091/authenticate', {
        username: loginUsername,
        password: loginPassword,
      })
      const token = response.data.token
      localStorage.setItem('token', token)
      setToken(token)
      setMessage('User authenticated successfully')
      setLoginUsername('')
      setLoginPassword('')
      setShowLoginForm(false)
      fetchUserInfo(token)
    } catch (error) {
      setMessage('Error logging in: ' + error.message)
    }
  }

  return (
    <CContainer>
      {message && <CAlert color="info">{message}</CAlert>}
      <CRow>
        <CCol xs="12" className="mb-4">
          {username ? (
            <p>Welcome, {username}</p>
          ) : (
            <>
              <CButton color="primary" onClick={() => setShowRegisterForm(true)}>
                Register
              </CButton>
              <CButton color="secondary" onClick={() => setShowLoginForm(true)} className="ms-2">
                Login
              </CButton>
            </>
          )}
        </CCol>
      </CRow>
      <CRow>
        {/* Register Form */}
        {showRegisterForm && (
          <CCol xs="12" md="6">
            <CCard>
              <CCardHeader>Register</CCardHeader>
              <CCardBody>
                <CForm onSubmit={handleRegister}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="registerUsername">Username</CFormLabel>
                    <CFormInput
                      id="registerUsername"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="registerPassword">Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="registerPassword"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <CButton type="submit" color="primary">
                    Register
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        )}
        {/* Login Form */}
        {showLoginForm && (
          <CCol xs="12" md="6">
            <CCard>
              <CCardHeader>Login</CCardHeader>
              <CCardBody>
                <CForm onSubmit={handleLogin}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="loginUsername">Username</CFormLabel>
                    <CFormInput
                      id="loginUsername"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <CFormLabel htmlFor="loginPassword">Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="loginPassword"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <CButton type="submit" color="primary">
                    Login
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        )}
      </CRow>
    </CContainer>
  )
}

export default Profile
