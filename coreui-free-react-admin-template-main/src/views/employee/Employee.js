import React, { useState, useEffect } from 'react'
import { Button, Modal, Table, Input } from 'antd'
import axios from 'axios'
import { FaUserEdit } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { CFormLabel, CFormInput } from '@coreui/react'

const Employee = () => {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalData, setModalData] = useState({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: '',
    lastName: '',
    age: '',
    educationDetails: '',
    role: '',
  })

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9091/employees/search`,
        {
          page: currentPage,
          size: pageSize,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      setData(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSearch = async () => {
    try {
      let queryParams = { ...searchCriteria }

      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === '') {
          delete queryParams[key]
        }
      })

      const response = await axios.post(
        `http://localhost:9091/employees/search`,
        {
          ...queryParams,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      setData(response.data.content)
      setTotalPages(1)
    } catch (error) {
      console.error('Error searching employees:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9091/employees/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      fetchData()
    } catch (error) {
      console.error('Error deleting employee:', error)
    }
  }

  const handleUpdate = async (record) => {
    try {
      setModalData(record)
      setIsAddingNew(false)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching employee data for update:', error)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setValidationErrors({})
  }

  const handleAddNew = () => {
    setModalData({})
    setIsAddingNew(true)
    setModalVisible(true)
  }

  const handleSave = async () => {
    try {
      if (validateForm()) {
        if (isAddingNew) {
          await axios.post('http://localhost:9091/employees/save', modalData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        } else {
          await axios.put(`http://localhost:9091/employees/update/${modalData.id}`, modalData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        }
        setModalVisible(false)
        fetchData()
        window.location.reload()
      }
    } catch (error) {
      console.error('Error saving employee data:', error)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!modalData.firstName) {
      errors.firstName = 'First Name is required'
    }
    if (!modalData.lastName) {
      errors.lastName = 'Last Name is required'
    }
    if (!modalData.age || isNaN(modalData.age)) {
      errors.age = 'Age is required and must be a number'
    }
    if (!modalData.educationDetails) {
      errors.educationDetails = 'Education Details is required'
    }
    if (!modalData.role) {
      errors.role = 'Role is required'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Education Details',
      dataIndex: 'educationDetails',
      key: 'educationDetails',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <FaUserEdit
            style={{ marginRight: '25px', marginLeft: '25px' }}
            onClick={() => handleUpdate(record)}
          />
          <RiDeleteBin6Line onClick={() => handleDelete(record.id)} />
        </span>
      ),
    },
  ]

  const paginationOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Input
          placeholder="Search by First Name"
          value={searchCriteria.firstName}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, firstName: e.target.value })}
        />
        <Input
          placeholder="Search by Last Name"
          value={searchCriteria.lastName}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, lastName: e.target.value })}
        />
        <Input
          placeholder="Search by Age"
          value={searchCriteria.age}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, age: parseInt(e.target.value, 10) || '' })
          }
        />
        <Input
          placeholder="Search by Role Name"
          value={searchCriteria.role}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, role: e.target.value })}
        />
        <Input
          placeholder="Search by Education Details"
          value={searchCriteria.educationDetails}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, educationDetails: e.target.value })
          }
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Button type="primary" onClick={handleAddNew} style={{ marginBottom: '10px' }}>
        Add Employee
      </Button>
      <div style={{ marginTop: '0.1in' }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: currentPage + 1,
            pageSize,
            total: totalPages * pageSize,
            showSizeChanger: true,
            pageSizeOptions: paginationOptions.map((option) => option.value),
            onChange: (page, pageSize) => {
              setCurrentPage(page - 1)
              setPageSize(pageSize)
            },
          }}
          rowKey="id"
        />
      </div>
      <Modal
        title={isAddingNew ? 'Add Employee' : 'Update Employee'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <div>
          <CFormLabel htmlFor="firstName">First Name:</CFormLabel>
          <CFormInput
            id="firstName"
            value={modalData.firstName}
            onChange={(e) => setModalData({ ...modalData, firstName: e.target.value })}
          />
          {validationErrors.firstName && (
            <p style={{ color: 'red' }}>{validationErrors.firstName}</p>
          )}
        </div>
        <div>
          <CFormLabel htmlFor="lastName">Last Name:</CFormLabel>
          <CFormInput
            id="lastName"
            value={modalData.lastName}
            onChange={(e) => setModalData({ ...modalData, lastName: e.target.value })}
          />
          {validationErrors.lastName && <p style={{ color: 'red' }}>{validationErrors.lastName}</p>}
        </div>
        <div>
          <CFormLabel htmlFor="age">Age:</CFormLabel>
          <CFormInput
            id="age"
            value={modalData.age}
            onChange={(e) => setModalData({ ...modalData, age: e.target.value })}
          />
          {validationErrors.age && <p style={{ color: 'red' }}>{validationErrors.age}</p>}
        </div>
        <div>
          <CFormLabel htmlFor="educationDetails">Education Details:</CFormLabel>
          <CFormInput
            id="educationDetails"
            value={modalData.educationDetails}
            onChange={(e) => setModalData({ ...modalData, educationDetails: e.target.value })}
          />
          {validationErrors.educationDetails && (
            <p style={{ color: 'red' }}>{validationErrors.educationDetails}</p>
          )}
        </div>
        <div>
          <CFormLabel htmlFor="role">Role:</CFormLabel>
          <CFormInput
            id="role"
            value={modalData.role}
            onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
          />
          {validationErrors.role && <p style={{ color: 'red' }}>{validationErrors.role}</p>}
        </div>
      </Modal>
    </div>
  )
}

export default Employee
