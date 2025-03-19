import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://3.223.253.106:9006/api/feedback')
      .then((response) => {
        console.log('API Response:', response.data) // Debugging API response
        if (Array.isArray(response?.data)) {
          setReviews(response?.data)
        } else if (response?.data?.data && Array.isArray(response?.data?.data)) {
          setReviews(response?.data?.data)
        } else {
          setReviews([]) // Fallback if the structure isn't as expected
        }
      })
      .catch((error) => {
        console.error('Error fetching Reviews:', error)
        setReviews([]) // Ensure Reviews is always an array
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  // Handle edit functionality
  const handleEdit = (id) => {
    navigate('/Blogeditor', { state: { id } })
  }

  // Handle delete functionality
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Blog?')) {
      axios
        .delete(` http://3.223.253.106:9006/api/feedback/${id}`)
        .then(() => {
          setReviews(reviews.filter((Blog) => Blog._id !== id))
        })
        .catch((error) => console.error('Error deleting Blog:', error))
    }
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard className="d-flex 100%">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h1 style={{ fontSize: '24px', color: 'purple' }}>Feedback</h1>
            
            </CCardHeader>
            <CCardBody>
              <CTable striped hover bordered responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Comment</CTableHeaderCell>

                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                {loading && <>
              
              <div className='text-center py-5 d-flex w-100'>Loading...</div>
             
              </>
              }
                  {Array?.isArray(reviews) &&
                    reviews?.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{item.name}</CTableDataCell>
                        <CTableDataCell>{item.email}</CTableDataCell>
                        <CTableDataCell>{item.comment}</CTableDataCell>

                        <CTableDataCell>
                          {/* <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: '#f0ad4e', cursor: 'pointer' }}
                        onClick={() => handleEdit(Blog._id)}
                      /> */}
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: '#bb1616', cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleDelete(item._id)}
                          />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ReviewList
