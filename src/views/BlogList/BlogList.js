import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

const BlogList = () => {
  const [Blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://44.196.64.110:9006/api/blog')
      .then(response => setBlogs(response.data))
      .catch(error => console.error('Error fetching Blogs:', error));
  }, []);

  const handleEdit = (id) => {
    navigate(`/Blogs/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Blog?')) {
      axios.delete(`http://44.196.64.110:9006/api/blog/${id}`)
        .then(() => setBlogs(Blogs.filter(Blog => Blog._id !== id)))
        .catch(error => console.error('Error deleting Blog:', error));
    }
  };

 

  return (
    <CRow>
      <CCol>
        <CCard className="d-flex 100%">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h1 style={{ fontSize: '24px', color: 'purple' }}>Blog Management List</h1>
            <CButton color="primary" size="sm" className="float-right" onClick={() => navigate('/Blogs/create')}>Create New Blog</CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover bordered responsive>
              <CTableHead color='dark'>
                <CTableRow>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Author</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Image 1</CTableHeaderCell>
                  <CTableHeaderCell>Image 2</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>

                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Blogs.map((Blog) => (
                  <CTableRow key={Blog._id}>
                    <CTableDataCell>{Blog.title}</CTableDataCell>
                    <CTableDataCell>{Blog.category}</CTableDataCell>
                    <CTableDataCell>{Blog.author}</CTableDataCell>
                    <CTableDataCell>{Blog.status}</CTableDataCell>
                    <CTableDataCell>
                      {Blog.image1 && (
                        <img
                          src={`http://localhost:9007/api/uploads/${Blog.image1}`}
                          alt="Blog"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {Blog.image2 && (
                        <img
                          src={`http://localhost:9007/api/uploads/${Blog.image2}`}
                          alt="Blog"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>{Blog.date}</CTableDataCell>
                    <CTableDataCell>
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: '#f0ad4e', cursor: 'pointer' }}
                        onClick={() => handleEdit(Blog._id)}
                      />
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
  );
};

export default BlogList;