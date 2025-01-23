import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function PlanEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [isMonthly, setIsMonthly] = useState('')
  const [isYearly, setIsYearly] = useState('')

  const handleTenureChange = (e) => {
    const tenure = e.target.value
    setIsMonthly(tenure === 'Monthly' ? true : false)
    setIsYearly(tenure === 'Yearly' ? true : false)
  }

  // Fetch plan data
  useEffect(() => {
    if (id) {
      axios
        .get(`http://44.196.64.110:9006/api/plan/getPlan/${id}`)
        .then(({ data }) => {
          console.log(data)
          setTitle(data.name)
          setPrice(data.price)
          setDescription(data.description)
          setIsMonthly(data.isMonthly)
          setIsYearly(data.isYearly)
        })
        .catch((error) => {
          console.error('Error fetching plan:', error)
          alert('Failed to fetch plan details. Please try again.')
        })
    }
  }, [id])

  console.log('title', title)

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedPlan = {
        name: title,
        price,
        description,
        isMonthly,
        isYearly,
      }
      await axios.put(`http://44.196.64.110:9006/api/plan/updatePlan/${id}`, updatedPlan)
      navigate('/plan') // Redirect to the plans list
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Failed to update the plan. Please try again.')
    }
  }

  return (
    <>
      <CCard>
        <CCardHeader>Edit Plan</CCardHeader>
        <CCardBody>
          <form className="row gy-4" onSubmit={handleSubmit}>
            <div className="col-lg-4">
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
            <div className="col-lg-4">
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
            <div className="col-lg-4">
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
            <div className="col-lg-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <ReactQuill value={description} onChange={setDescription} />
            </div>
            <CButton type="submit" color="primary">
              Update
            </CButton>
          </form>
        </CCardBody>
      </CCard>
    </>
  )
}
