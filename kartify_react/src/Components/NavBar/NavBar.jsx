import React, { useState } from 'react'
import './NavBar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart.png'

const NavBar = () => {

    const [menu, setMenu] = useState('shop');

  return (
    <div className = 'navbar'>
        <div className='nav-logo'>
            <img src = {logo} alt="image of a cart" />
            <p> KARTIFY</p>
        </div>
        <ul className='nav-menu'>
            <li onClick={() => {setMenu('shop')}}> Shop {menu === 'shop'? <hr/>:<></>}</li>
            <li onClick={() => {setMenu('Electronics')}}> Electronics {menu === 'Electronics'? <hr/>:<></>}</li>
            <li onClick={() => {setMenu('Clothing')}}> Clothing {menu === 'Clothing'? <hr/>:<></>}</li>
            <li onClick={() => {setMenu('Home Appliances')}}> Home Appliances {menu === 'Home Appliances'? <hr/>:<></>}</li>
        </ul>
        <div className='nav-login-cart'>
            <button>Login</button>
            <img src={cart_icon} alt='cart items'/>
            <div className='nav-cart-count'>0</div>
        </div>
    </div>
  )
}

export default NavBar