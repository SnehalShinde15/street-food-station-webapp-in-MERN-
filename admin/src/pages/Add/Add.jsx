import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {


    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        rating: ""
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Image not selected');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("rating", Number(data.rating));
        formData.append("image", image);
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                description: "",
                price: "",
                category: data.category,
                rating: ""
            })
            setImage(false);
        }
        else {
            toast.error(response.data.message)
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    return (
        <div className='add'>
            <ToastContainer />
            <h1>Add Food Item</h1>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Product name</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Type here' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Product description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Write content here' required />
                </div>
                <div className='add-category flex-col'>
                        <p>Product category</p>
                        <select 
                            name='category' 
                            onChange={onChangeHandler} 
                            className='add-product-name'
                            style={{ width: 'max(100%, 280px)', padding: '10px' }}
                        >
                        <option value="">Select Category</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Momos">Momos</option>
                            <option value="Burger">Burger</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Pav Bhaji">Pav Bhaji</option>
                            <option value="South Indian">South Indian</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Cake">Cake</option>
                            <option value="Ice Cream">Ice Cream</option>

                        </select>
                    </div>
                <div className='add-category-price'>
                    <div className='add-rating flex-col'>
                        <p>Product Rating</p>
                        <input 
                            type="number"
                            name="rating"
                            placeholder="Rating"
                            min="1"
                            max="5"
                            step="1"
                            required
                            value={data.rating} 
                            onChange={onChangeHandler}
                            
                        />
                    </div>
                    <div className='add-price flex-col'>
                        <p>Product Price</p>
                        <input type="number"
                        placeholder="Enter Product Price"
                        name="price"
                        min="0"
                        step="1"
                        required
                        value={data.price} onChange={onChangeHandler}  />
                        </div>
                    </div>
                
                <button type='submit' className='add-btn' >ADD</button>
            </form>
        </div>
    )
}

export default Add