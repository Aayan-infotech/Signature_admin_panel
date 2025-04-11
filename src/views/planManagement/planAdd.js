import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
export default function PlanAdd() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [PlanFeature, setPlanFeature] = useState('')
  const [isMonthly, setIsMonthly] = useState('')
  const [isYearly, setIsYearly] = useState('')

  const handleTenureChange = (e) => {
    const tenure = e.target.value
    setIsMonthly(tenure === 'Monthly' ? true : false)
    setIsYearly(tenure === 'Yearly' ? true : false)
  }

  const handlePlanChange = (e) => {
    const plan = e.target.value
    setPlanFeature(plan === 'basic' ? 'basic' : 'full')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const addPlan = {
        name: title,
        price,
        description,
        isMonthly,
        isYearly,
        PlanFeature
      }
      await axios.post(`https://signatouch.com/api/plan/createPlan`, addPlan)
      navigate('/plan') // Redirect to the plans list
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Failed to update the plan. Please try again.')
    }
  }

  console.log(PlanFeature)
  return (
    <>
      <CCard>
        <CCardHeader>Add Plan</CCardHeader>
        <CCardBody>
          <form className="row gy-4" onSubmit={handleSubmit}>
            <div className="col-lg-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="col-lg-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="col-lg-3">
              <label htmlFor="tenure" className="form-label">
                Tenure
              </label>
              <select
                id="tenure"
                name="tenure"
                value={isMonthly ? 'Monthly' : 'Yearly'}
                onChange={handleTenureChange}
                className="form-select"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="col-lg-3">
              <label htmlFor="tenure" className="form-label">
                Plan
              </label>
              <select
                id="tenure"
                name="tenure"
                value={PlanFeature === 'basic' ? 'basic' : 'full'}
                onChange={handlePlanChange}
                className="form-select"
              >
                <option value="basic">Basic</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div className="col-lg-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <ReactQuill value={description} onChange={setDescription} />
            </div>
            <CButton type="submit" color="primary">
              Add Plan
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </>
  )
}
