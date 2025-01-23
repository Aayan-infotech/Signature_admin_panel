// BlogEdit.jsx
import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toISOString().split('T')[0] : ''

const BlogEdit = () => {
  const [blog, setBlog] = useState({
    title: '',
    category: '',
    content: '',
    date: '',
    author: 'Admin',
    status: 'draft',
  })
  const [existingImages, setExistingImages] = useState([]) // For existing image URLs
  const [newImages, setNewImages] = useState([]) // For new image files
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      axios
        .get(`http://44.196.64.110:9006/api/blog/getBlog/${id}`)
        .then(({ data }) => {
          setBlog({ ...data, date: formatDate(data.date) })
          setExistingImages(data.images || [])
        })
        .catch((error) => {
          console.error('Error fetching blog:', error)
          alert('Failed to fetch blog details. Please try again.')
        })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setBlog((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content) => {
    setBlog((prev) => ({ ...prev, content }))
  }

  const handleImagesChange = (e) => {
    setNewImages((prevNewImages) => [...prevNewImages, ...Array.from(e.target.files)])
  }

  const handleDelete = (index, isExisting) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      if (isExisting) {
        const updatedImages = existingImages.filter((_, imgIndex) => imgIndex !== index)
        setExistingImages(updatedImages)
        setBlog((prev) => ({ ...prev, existingImages: updatedImages })) // Update blog data
      } else {
        setNewImages((prev) => prev.filter((_, imgIndex) => imgIndex !== index))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(blog).forEach(([key, value]) => formData.append(key, value))

    existingImages.forEach((image) => {
      formData.append('existingImages', image) // Append existing image URLs
    })

    newImages.forEach((image) => {
      formData.append('images', image) // Append new image files
    })

    try {
      if (id) {
        await axios.put(`http://44.196.64.110:9006/api/blog/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('Blog updated successfully!')
        // Fetch the updated data
        const { data } = await axios.get(`http://44.196.64.110:9006/api/blog/getBlog/${id}`)
        setBlog({ ...data, date: formatDate(data.date) })
        setExistingImages(data.images || [])
        navigate('/blog')
      }
    } catch (error) {
      console.error('Error saving blog:', error.response?.data || error.message)
      alert('Failed to save the blog. Please try again.')
    }
  }
  console.log(blog)

  return (
    <CCard>
      <CCardHeader>{id ? 'Edit Blog' : 'Create Blog'}</CCardHeader>
      <CCardBody>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={blog.title}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              id="category"
              name="category"
              value={blog.category}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <ReactQuill value={blog.content} onChange={handleContentChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="form-label">
              Author
            </label>
            <input
              id="author"
              name="author"
              value={blog.author}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={blog.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">
              Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImagesChange}
              className="form-control"
              multiple
            />
            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="mt-2">
                <h6>Selected Images:</h6>
                <ul className="list-unstyled d-flex flex-row gap-2 align-items-center">
                  {existingImages.map((image, index) => (
                    <li key={`existing-${index}`}>
                      <div className="position-relative">
                        <button
                          className="btn-close position-absolute top-0 end-0 me-2"
                          onClick={() => handleDelete(index, true)}
                          style={{ cursor: 'pointer' }}
                        />
                        <img src={image} alt="Blog" style={{ width: '100px', height: '100px' }} />
                      </div>
                    </li>
                  ))}
                  {newImages.map((image, index) => (
                    <li key={`new-${index}`}>
                      <div className="position-relative">
                        <button
                          className="btn-close position-absolute top-0 end-0 me-2"
                          onClick={() => handleDelete(index, false)}
                          style={{ cursor: 'pointer' }}
                        />
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Blog"
                          style={{ width: '100px', height: '100px' }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={blog.date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <CButton type="submit" color="primary">
            {id ? 'Update' : 'Save'}
          </CButton>
        </form>
      </CCardBody>
    </CCard>
  )
}

export default BlogEdit
