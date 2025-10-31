import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useEffect } from 'react'
import {assets} from "../../assets/assets"
const Orders = ({url}) => {

  const [orders,setOrders] = useState([]);
  const statusHandler = async (event,orderId)=>{
      const response = await axios.post(url+"/api/order/status",{orderId,
        status:event.target.value
      })

      if(response.data.success){
       await fetchAllOrders();
      }
  }
  const fetchAllOrders = async ()=>{
    const response = await axios.get(url+"/api/order/list")
    if(response.data.success){
      setOrders(response.data.data);
      console.log(response.data.data)
    }
    else{
      toast.error("Error")
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])
  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order_list">
        {orders.map((order,index)=>(
          <div key={index} className="order_item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order_item_food">
                {order.items.map((item,i)=>{
                  if(i===order.items.length-1){
                    return item.name +" x " + item.quantity
                  }
                  else{
                    return item.name +" x " + item.quantity +","
                  }
                })}
              </p>
              <p className="order_item_name">{order.address.firstName +" " + order.address.lastName}</p>
              <div className="order_item_address">
              <p>{order.address.street+","}</p>
              <p>{order.address.city +"," + order.address.state +"," + order.address.country+"," + order.address.zipcode }</p>
              </div>
              <p className='order_item_phone'>{order.address.phone}</p>
            </div>
            <p>Items:Total amount:{order.items.length}</p>
            <p>Total amount:{order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
     
    </div>
  )
}

export default Orders
