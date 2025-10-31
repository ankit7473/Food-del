import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Cart from './Pages/Cart/Cart'
import Home from './Pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/LoginpopUp/LoginPopUp'
import Verify from './Pages/Verify/Verify'
import Myorders from './Pages/Myordes/Myorders'
const App = () => {
  const[showLogin,setShowLogin]=useState(false);
  return (
    <>
    {showLogin?<LoginPopUp setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Cart' element={<Cart/>} />
        <Route path='/Order' element={<PlaceOrder/>} />
        <Route path='/Verify' element={<Verify/>}/>
        <Route path="/Myorders" element={<Myorders/>}/>
      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App
