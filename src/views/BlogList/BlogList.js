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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'

const BlogList = () => {
  const [Blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null) // State for selected blog
  const navigate = useNavigate()

  // Fetch blogs from the API
  useEffect(() => {
    setLoading(true)
    axios
      .get('http://54.236.98.193:9006/api/blog/getBlog')
      .then((response) => {
        console.log('API Response:', response.data) // Debugging API response
        if (Array.isArray(response.data)) {
          setBlogs(response.data)
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setBlogs(response.data.data)
        } else {
          setBlogs([]) // Fallback if the structure isn't as expected
        }
      })
      .catch((error) => {
        console.error('Error fetching Blogs:', error)
        setBlogs([]) // Ensure Blogs is always an array
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Handle delete functionality
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Blog?')) {
      axios
        .delete(`http://54.236.98.193:9006/api/blog/delete/${id}`)
        .then(() => {
          setBlogs(Blogs.filter((Blog) => Blog._id !== id))
        })
        .catch((error) => console.error('Error deleting Blog:', error))
    }
  }

  // Show details in modal
  const handleViewDetails = (Blog) => {
    setSelectedBlog(Blog) // Set selected blog
    setVisible(true) // Open modal
  }

  console.log(selectedBlog)

  return (
    <>
      <CRow>
        <CCol>
          <CCard className="d-flex 100%">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h1 style={{ fontSize: '24px', color: 'purple' }}>Blog Management</h1>
              <CButton
                color="primary"
                size="sm"
                className="float-right"
                onClick={() => navigate('/Blogeditor')}
              >
                Create New Blog
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover bordered responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>Title</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Author</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Image</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading && <div className="text-center py-5 d-flex w-100">Loading...</div>}
                  {Array.isArray(Blogs) &&
                    Blogs.map((Blog) => (
                      <CTableRow key={Blog._id}>
                        <CTableDataCell>{Blog.title}</CTableDataCell>
                        <CTableDataCell>{Blog.category}</CTableDataCell>
                        <CTableDataCell>{Blog.author}</CTableDataCell>
                        <CTableDataCell>{Blog.status}</CTableDataCell>
                        <CTableDataCell>
                          {Blog.images && (
                            <img
                              src={Blog.images[0]}
                              alt="Blog"
                              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {new Date(Blog.date).toISOString().split('T')[0]}
                        </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            icon={faEye}
                            style={{ color: '#f0ad4e', cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleViewDetails(Blog)}
                          />
                          <Link to={`/blogedit/${Blog._id}`}>
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: '#f0ad4e', cursor: 'pointer', marginLeft: '10px' }}
                            />
                          </Link>

                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: '#bb1616', cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleDelete(Blog._id)}
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

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Blog Detail</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedBlog ? (
            <div>
              <h3>{selectedBlog.title}</h3>
              <p>
                <strong>Category:</strong> {selectedBlog.category}
              </p>
              <p>
                <strong>Author:</strong> {selectedBlog.author}
              </p>
              <p>
                <strong>Status:</strong> {selectedBlog.status}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedBlog.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Content:</strong> {selectedBlog.content}
              </p>
              {selectedBlog.images && selectedBlog.images.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedBlog.images.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt={`Blog Image ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>No blog selected.</p>
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default BlogList
