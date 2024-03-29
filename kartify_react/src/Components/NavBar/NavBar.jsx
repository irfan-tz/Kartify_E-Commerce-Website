import React, { useEffect, useState } from 'react'
import './NavBar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart.png'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Actions/userActions'
import axios from 'axios'

const NavBar = () => {

    const [menu, setMenu] = useState('shop');
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    //const [cartItems, setCartItems] = useState([]);
    const [cartQuantity, setCartQuantity] = useState([]);

    const fetchCartItems = async () => {
        try {
            if (userInfo) {
                const response = await axios.get(`/getCartItems/${userInfo.email}`);
                const items = response.data;
        
                let totalQuantity = 0;
                for (const cartItem of items) {
                    totalQuantity += cartItem.quantity;
                    console.log(cartItem.quantity)
                }
                console.log("Cart quantity:")
                console.log(totalQuantity)
                setCartQuantity(totalQuantity);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [userInfo]);

    const dispatch = useDispatch()
    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="image of a cart" />
                <p> KARTIFY</p>
            </div>
            <ul className='nav-menu'>
                <Link to="/">
                    <button onClick={() => { setMenu('shop') }} className="btn btn-lg"> Shop {menu === 'shop' ? <hr /> : <></>}</button>
                </Link>
                <button onClick={() => { setMenu('Electronics') }} className="btn btn-lg"> Electronics {menu === 'Electronics' ? <hr /> : <></>}</button>
                <button onClick={() => { setMenu('Clothing') }} className="btn btn-lg"> Clothing {menu === 'Clothing' ? <hr /> : <></>}</button>
                <button onClick={() => { setMenu('Home Appliances') }} className="btn btn-lg"> Home Appliances {menu === 'Home Appliances' ? <hr /> : <></>}</button>
            </ul>

            {userInfo ?
                (
                    <div className='nav-login-cart'>
                        <h4>Welcome, {userInfo.first_name.toUpperCase()}</h4>
                        <button className="btn btn-lg "><Link onClick={logoutHandler}> Logout </Link></button>
                        <Link to='/cart'>
                            <img src={cart_icon} alt='cart items' />
                        </Link>
                        <div className='nav-cart-count'> {cartQuantity} </div>

                    </div>
                )
                : (
                    <div className='nav-login-cart'>
                        <button className="btn btn-lg "><Link to="/login"> Login </Link></button>
                        <Link to='/cart'>
                            <img src={cart_icon} alt='cart items' />
                        </Link>
                        <div className='nav-cart-count'> 0 </div>
                    </div>
                )
            }
        </div>
    )
}

export default NavBar