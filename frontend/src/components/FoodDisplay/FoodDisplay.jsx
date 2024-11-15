import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { FaFilter } from 'react-icons/fa'; // Import filter icon

const FoodDisplay = ({ category }) => {
    const { food_list, url } = useContext(StoreContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({ price: '', rating: '', name: '' });

    // Filter function
    const applyFilters = (item) => {
        return (
            (category === "All" || category === item.category) &&
            (filters.price === '' || item.price <= parseFloat(filters.price)) &&
            (filters.rating === '' || item.rating >= parseFloat(filters.rating)) &&
            (filters.name === '' || item.name.toLowerCase().includes(filters.name.toLowerCase()))
        );
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-header">
                <h2>You can find the best {category} here</h2>
                <FaFilter onClick={() => setShowFilter(!showFilter)} className="filter-icon" />
            </div>
            {showFilter && (
                <div className="filter-options">
                    <input
                        type="number"
                        name="price"
                        placeholder="Max Price"
                        value={filters.price}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="rating"
                        placeholder="Min Rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={handleFilterChange}
                    />
                </div>
            )}
            <div className="food-display-list">
                {food_list && food_list.length > 0 ? (
                    food_list.filter(applyFilters).map((item, index) => (
                        <FoodItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            rating={item.rating}
                            description={item.description}
                            price={item.price}
                            image={url+"/images/"+item.image}
                        />
                    ))
                ) : (
                    <p>No food items available</p>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;