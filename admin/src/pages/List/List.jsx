import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import 'react-toastify/dist/ReactToastify.css';

const List = () => {
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set items per page
  const categories = ['Pizza', 'Momos', 'Burger', 'Sandwich', 'Pav Bhaji', 'South Indian', 'Pasta', 'Chinese', 'Cake', 'Ice Cream'];

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error fetching food list");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
    } else {
      toast.error("Error removing food item");
    }
  };

  const editFood = (item) => {
    setEditItem(item);
    setName(item.name || '');
    setCategory(item.category || '');
    setDescription(item.description || '');
    setRating(item.rating || '');
    setPrice(item.price || '');
    setImage(null);
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const updateFood = async () => {
    if (!editItem) return;

    try {
      const formData = new FormData();
      formData.append('id', editItem._id);
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('rating', rating);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(`${url}/api/food/edit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEditItem(null);
        setName('');
        setCategory('');
        setPrice('');
        setDescription('');
        setRating('');
        setImage(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error updating food item');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination logic
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='list add flex-col'>
      <h1>All Foods List</h1>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Rating</b>
          <b>Description</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {currentItems.map((item) => (
          <div key={item._id} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt='food' />
            <p>{item.name || 'N/A'}</p>
            <p>{item.category || 'N/A'}</p>
            <p>{item.rating || 'N/A'}</p>
            <p>{item.description || 'N/A'}</p>
            <p>{item.price || 'N/A'}</p>
            <p className='cursor'>
              <img onClick={() => editFood(item)} className='cursor-img' src={assets.edit} alt='edit' />
              <img onClick={() => removeFood(item._id)} className='cursor-img' src={assets.remove} alt='remove' />
            </p>
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'disabled' : ''}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <button 
              key={pageNumber} 
              onClick={() => handlePageChange(pageNumber)} 
              className={currentPage === pageNumber ? 'active' : ''}
            >
              {pageNumber}
            </button>
          );
        })}

        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? 'disabled' : ''}
        >
          Next
        </button>
      </div>

      {editItem && (
        <div className='edit-form'>
          <h3>Edit Food Item</h3>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
          />
          <input
            type='number'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder='Rating'
          />
          <input
            type='number'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price'
          />
          <div className='edit-image-upload'>
            <p>Upload New Image</p>
            <input
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button onClick={updateFood}>Update</button>
        </div>
      )}

    </div>
  );
}

export default List;
