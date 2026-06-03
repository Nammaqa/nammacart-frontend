import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import './FoodDisplay.css'

const FoodDisplay = ({ category }) => {

  const { food_list, searchTerm } = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
      <h3>Top Dishes near you</h3>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          // filter by category
          if (!(category === "All" || category === item.category)) return null;
          // filter by search term if present
          if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return null;
          return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
        })}
      </div>
    </div>
  )
}

export default FoodDisplay
