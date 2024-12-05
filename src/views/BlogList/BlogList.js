import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const BlogList = () => {
  const [Blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  // Fetch blogs from the API
  useEffect(() => {
    axios
      .get('http://44.196.64.110:9006/api/blog/getBlog')
      .then((response) => {
        console.log('API Response:', response.data); // Debugging API response
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setBlogs(response.data.data);
        } else {
          setBlogs([]); // Fallback if the structure isn't as expected
        }
      })
      .catch((error) => {
        console.error('Error fetching Blogs:', error);
        setBlogs([]); // Ensure Blogs is always an array
      });
  }, []);

  // Handle edit functionality
  const handleEdit = (id) => {
    navigate('/Blogeditor',{state:{id}});
    };

  // Handle delete functionality
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Blog?')) {
      axios
        .delete(`http://44.196.64.110:9006/api/blog/delete/${id}`)
        .then(() => {
          setBlogs(Blogs.filter((Blog) => Blog._id !== id));
        })
        .catch((error) => console.error('Error deleting Blog:', error));
    }
  };

  return (
    <CRow>
      <CCol>
        <CCard className="d-flex 100%">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h1 style={{ fontSize: '24px', color: 'purple' }}>Blog Management List</h1>
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
                {Array.isArray(Blogs) && Blogs.map((Blog) => (
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
                      {/* <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: '#f0ad4e', cursor: 'pointer' }}
                        onClick={() => handleEdit(Blog._id)}
                      /> */}
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
