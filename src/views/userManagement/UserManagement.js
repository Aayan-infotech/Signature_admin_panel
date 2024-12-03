import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardHeader,
    CListGroup,
    CListGroupItem,
    CCardText,
    CRow,
    CCol,
    CButton,
} from '@coreui/react';

const UserManagement = () => {
    const [users, setUsers] = useState([]); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [usersPerPage] = useState(10); 

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://44.196.64.110:9006/api/user');
                const data = await response.json();

                const usersArray = Array.isArray(data.data) ? data.data : [];
                
                const filteredData = usersArray.map((user) => ({
                    id: user._id,
                    email: user.email,
                    createdAt: user.createdAt,
                }));

                setUsers(filteredData); 
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Calculate the indexes for the current page users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <CCard>
            <CCardHeader>
                <CRow>
                    <div className="d-flex justify-content-between align-items-center">
                        <CCol>User Management</CCol>
                    </div>
                </CRow>
            </CCardHeader>
            <CListGroup flush>
                <CListGroupItem>
                    <CCardText>
                        <CRow xs={{ gutterX: 2 }}>
                            <CCol><div className="p-3 fw-bold">#</div></CCol>
                            <CCol><div className="p-3 fw-bold">Email</div></CCol>
                            <CCol><div className="p-3 fw-bold">Created At</div></CCol>
                        </CRow>
                    </CCardText>
                </CListGroupItem>
                {currentUsers.map((user, index) => (
                    <CListGroupItem key={user.id}>
                        <CCardText>
                            <CRow xs={{ gutterX: 2 }}>
                                <CCol><div className="p-3">{indexOfFirstUser + index + 1}</div></CCol>
                                <CCol><div className="p-3">{user.email}</div></CCol>
                                <CCol><div className="p-3">{new Date(user.createdAt).toLocaleDateString()}</div></CCol>
                            </CRow>
                        </CCardText>
                    </CListGroupItem>
                ))}
            </CListGroup>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
                <CButton
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                >
                    Previous
                </CButton>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                    <CButton
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </CButton>
                ))}

                <CButton
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                >
                    Next
                </CButton>
            </div>
        </CCard>
    );
};

export default UserManagement;
