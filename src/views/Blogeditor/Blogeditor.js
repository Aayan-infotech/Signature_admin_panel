import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader } from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const BlogEditor = () => {
  const [Blog, setBlog] = useState({ title: '', category: '', content: '', date: '', author: 'Admin', status: 'draft' });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://44.196.64.110:9006/api/blog/getBlog/${id}`)
        .then((response) => {
          const BlogData = response.data;
          setBlog({
            ...BlogData,
            date: formatDate(BlogData.date),
          });
          setImages(BlogData.images || []);
        })
        .catch((error) => console.error('Error fetching Blog:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...Blog, [name]: value });
  };

  const handleContentChange = (content) => {
    setBlog({ ...Blog, content });
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', Blog.title);
    formData.append('category', Blog.category);
    formData.append('content', Blog.content);
    formData.append('date', Blog.date);
    formData.append('author', Blog.author);
    formData.append('status', Blog.status);

    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });

    try {
      if (id) {
        await axios.put(`http://44.196.64.110:9006/api/blog/update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        window.alert('Blog updated successfully!');
      } else {
        await axios.post(`http://44.196.64.110:9006/api/blog/createBlog`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        window.alert('Blog created successfully!');
      }

      // Navigate after the alert
      navigate('/Blogeditor');
    } catch (error) {
      console.error('Error saving Blog:', error.response?.data || error.message);
      window.alert('Failed to save the blog. Please try again.');
    }
  };

  return (
    <CCard>
      <CCardHeader>{id ? 'Edit Blog' : 'Create Blog'}</CCardHeader>
      <CCardBody>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input id="title" name="title" value={Blog.title} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <input id="category" name="category" value={Blog.category} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Content</label>
            <ReactQuill value={Blog.content} onChange={handleContentChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="form-label">Author</label>
            <input id="author" name="author" value={Blog.author} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select id="status" name="status" value={Blog.status} onChange={handleChange} className="form-select">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="images" className="form-label">Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImagesChange}
              className="form-control"
              multiple
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input id="date" name="date" type="date" value={Blog.date} onChange={handleChange} className="form-control" />
          </div>
          <CButton type="submit" color="primary">{id ? 'Update' : 'Save'}</CButton>
        </form>
      </CCardBody>
    </CCard>
  );
};

export default BlogEditor;
