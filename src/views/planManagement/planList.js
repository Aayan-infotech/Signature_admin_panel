import react, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function PlanList() {
  const [plans, setPlans] = useState([])
  const [planModal, setPlanModal] = useState([])
  const [visible, setVisible] = useState(false)

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:9006/api/plan/getAllPlans')
      console.log(response)
      if (response.status === 200) {
        setPlans(response?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPlansById = async (id) => {
    try {
      const response = await axios.get(`http://44.196.64.110:9006/api/plan/getPlan/${id}`)
      console.log(response)
      if (response.status === 200) {
        setPlanModal(response?.data)
        setVisible(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  console.log(plans)

  return (
    <>
      <CTable hover>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Price</CTableHeaderCell>
            <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {plans.map((plan, index) => (
            <>
              <CTableRow key={plan._id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>

                <CTableDataCell>{plan.name}</CTableDataCell>
                <CTableDataCell>{plan.price}</CTableDataCell>
                <CTableDataCell>{plan.isMonthly === true ? '30 days' : '1 year'}</CTableDataCell>
                <CTableDataCell>
                  <FontAwesomeIcon
                    icon={faEye}
                    style={{ color: '#f0ad4e', cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => fetchPlansById(plan._id)}
                  />
                  <Link to={`/plan/${plan._id}`}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ color: '#f0ad4e', cursor: 'pointer', marginLeft: '10px' }}
                    />
                  </Link>
                </CTableDataCell>
              </CTableRow>
            </>
          ))}
        </CTableBody>
      </CTable>

      <CModal
        visible={visible}
        alignment="center"
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader className="border-0">
          <CModalTitle id="LiveDemoExampleLabel">Your Plan</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h3>{planModal.name}</h3>
          <h6>{planModal.price}</h6>
          <p>{planModal.isMonthly === true ? '30 days' : null}</p>
          <p>{planModal.isYearly === true ? '1 Year' : null}</p>
          <div dangerouslySetInnerHTML={{ __html: planModal.description }} />
        </CModalBody>
      </CModal>
    </>
  )
}
