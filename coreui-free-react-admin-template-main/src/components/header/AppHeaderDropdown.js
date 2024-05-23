import React, { useEffect, useState } from 'react'
import { CAvatar, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserInfo(token)
    }
  }, [])

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get('http://localhost:9091/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsername(response.data.username)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUsername('')
    navigate('/register')
    setMessage('User logged out successfully')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem>
          <CIcon icon="cil-user" className="me-2" />

          <center> User: {username}</center>
        </CDropdownItem>
        <CDropdownItem href="#" onClick={handleLogout}>
          <center>Logout</center>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
