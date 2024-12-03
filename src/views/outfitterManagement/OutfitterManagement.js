import React, { useState } from 'react';
import {
    CCard,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CListGroup,
    CListGroupItem,
    CCardText,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CForm,
    CFormInput,
    CFormSelect,
    CFormCheck
} from '@coreui/react';

const OutfitterManagement = () => {
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [selectedOutfitter, setSelectedOutfitter] = useState(null);
    const [outfitters, setOutfitters] = useState([
        { id: 1, name: 'Jacob', company: 'Thornton', place: '@Otto', contact: '35468859085', verified: false },
        { id: 2, name: 'Jacob', company: 'Thornton', place: '@Otto', contact: '475675629857', verified: false },
        { id: 3, name: 'Jacob', company: 'Thornton', place: '@Otto', contact: '46587687', verified: false },
    ]);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        place: '',
        contact: '',
        file: null
    });

    const handleVerify = (id) => {
        setOutfitters(outfitters.map(outfitter =>
            outfitter.id === id ? { ...outfitter, verified: true } : outfitter
        ));
        setVisible(false);
    };

    const handleDelete = (id) => {
        setOutfitters(outfitters.filter(outfitter => outfitter.id !== id));
    };

    const handleAddOutfitter = (event) => {
        event.preventDefault();
        const newOutfitter = {
            id: outfitters.length + 1,
            ...formData,
            verified: false
        };
        setOutfitters([...outfitters, newOutfitter]);
        setFormVisible(false);
        setFormData({
            name: '',
            company: '',
            place: '',
            contact: '',
            file: null
        });
    };

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [id]: files[0] });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    return (
        <>
            <CCard>
                <CCardHeader>
                    <CRow>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <CCol>
                                    Outfitter Management
                                </CCol>
                            </div>
                            <div className='px-4'>
                                <CCol>
                                    <CButton color="primary" className='px-4' onClick={() => setFormVisible(true)}>Add Outfitters</CButton>
                                </CCol>
                            </div>
                        </div>
                    </CRow>
                </CCardHeader>
                <CListGroup flush>
                    <CListGroupItem>
                        <CCardText>
                            <CRow xs={{ gutterX: 2 }}>
                                <CCol><div className="p-3 fw-semibold">#</div></CCol>
                                <CCol><div className="p-3  px-1 fw-bolder">Name</div></CCol>
                                <CCol><div className="p-3 fw-bolder">Company/Guide Name</div></CCol>
                                <CCol><div className="p-3 fw-bolder">Place Name</div></CCol>
                                <CCol><div className="p-3 fw-bolder">Contact</div></CCol>
                                <CCol><div className="p-3 fw-bolder">Action</div></CCol>
                                <CCol><div className="p-3 fw-bolder">Verification</div></CCol>
                            </CRow>
                        </CCardText>
                    </CListGroupItem>
                    {outfitters.map(outfitter => (
                        <CListGroupItem key={outfitter.id}>
                            <CCardText>
                                <CRow xs={{ gutterX: 2 }}>
                                    <CCol><div className="p-3">{outfitter.id}</div></CCol>
                                    <CCol><div className="p-3 px-1">{outfitter.name}</div></CCol>
                                    <CCol><div className="p-3">{outfitter.company}</div></CCol>
                                    <CCol><div className="p-3">{outfitter.place}</div></CCol>
                                    <CCol><div className="p-3">{outfitter.contact}</div></CCol>
                                    <CCol>
                                        <div className="p-3">
                                            <CButton color="secondary" variant="outline" className='p-1'>✏</CButton>  
                                            <CButton color="danger" variant="outline" className='p-1' onClick={() => handleDelete(outfitter.id)}>🗑</CButton> 
                                            <CButton 
                                                color="info" 
                                                onClick={() => { setSelectedOutfitter(outfitter); setVisible(true); }} 
                                                variant="outline" 
                                                className='p-1'
                                            >👁‍🗨</CButton>
                                        </div>
                                    </CCol>
                                    <CCol>
                                        <div className="p-3">
                                            {outfitter.verified ? '✅' : '❌'}
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardText>
                        </CListGroupItem>
                    ))}
                </CListGroup>
            </CCard>

            <CModal visible={formVisible} onClose={() => setFormVisible(false)}>
                <CModalHeader onClose={() => setFormVisible(false)}>
                    <CModalTitle>Add Outfitter</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddOutfitter}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="company" label="Company/Guide Name" value={formData.company} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput id="place" label="Place Name" placeholder="1234 Main St" value={formData.place} onChange={handleChange}/>
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput id="contact" label="Contact Number" value={formData.contact} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput id="file" type="file" onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                           
                        <CButton color="primary" type="submit">Add</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setFormVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            {selectedOutfitter && (
                <CModal visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader onClose={() => setVisible(false)}>
                        <CModalTitle>Verification</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Verify {selectedOutfitter.name}'s documents.</p>
                        <CForm className="row g-3">
                            <CCol xs={12}>
                                <CFormInput type="file" id="verificationFile" label="Upload Verification Document" />
                            </CCol>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                        <CButton color="info" onClick={() => handleVerify(selectedOutfitter.id)}>
                            Verify
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}
        </>
    );
}

export default OutfitterManagement;