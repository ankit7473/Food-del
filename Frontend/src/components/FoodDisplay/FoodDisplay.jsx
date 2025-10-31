import React, { useContext } from 'react'
import './FoodDislplay.css'
import { StoreContext } from '../../Context/StoreContext'
import Fooditem from '../Fooditem/Fooditem' // Fixed import path

const FoodDisplay = ({category}) => {
    const{food_list}=useContext(StoreContext)

  return (
    <div className='food_display' id='food_display'>
      <h2>Top dishes near you</h2>
      <div className="food_display_list">
        {food_list.map((item,index)=>{
          if(category==="All" || category===item.category){
             return <Fooditem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
          } 
        })}
      </div>
    </div>
  )
}

export default FoodDisplay