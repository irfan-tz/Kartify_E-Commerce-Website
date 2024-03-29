import React, { useEffect, useState } from 'react';
import { Form, Link } from "react-router-dom";
import { Container, Row, Col, Button, ListGroup, Image, Alert } from 'react-bootstrap';
import NavBar from '../Components/NavBar/NavBar';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Cart = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [cartItems, setCartItems] = useState([]);
  const [itemNames, setItemNames] = useState({});
  const [disputingItems, setDisputingItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      if (userInfo) {
        const response = await axios.get(`/getCartItems/${userInfo.email}`);
        setCartItems(response.data);
        const itemNamesData = {};
        for (const cartItem of response.data) {
          const itemResponse = await axios.get(`/item/${cartItem.item_id}`);
          itemNamesData[cartItem.item_id] = itemResponse.data.item_name;
        }
        setItemNames(itemNamesData);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userInfo]);

  const removeFromCart = async (cartItem) => {
    try {
      await axios.post('http://127.0.0.1:8000/removeFromCart/', {
        c_email: userInfo.email,
        item_id: cartItem.item_id
      });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  useEffect(() => {
    // Check if any item quantity is less than the cart quantity
    const checkQuantity = async () => {
      let disputingItemsData = [];
      for (const cartItem of cartItems) {
        const response = await axios.get(`http://127.0.0.1:8000/item/${cartItem.item_id}`);
        console.log(response.data)
        const item = response.data;
        if (item.quantity < cartItem.quantity) { // Use cartItem.quantity instead of cartItem.cart_quantity
          disputingItemsData.push({
            itemName: item.item_name,
            cartQuantity: cartItem.quantity,
            availableQuantity: item.quantity
          });
        }
      }
      setDisputingItems(disputingItemsData);
    };

    checkQuantity();
  }, [cartItems]);

  return (
    <Container>
      <NavBar />
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div>
            <h6><br />Items in your cart:</h6>
            <ListGroup variant='flush'>
              {cartItems.map((cartItem, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <p>{index + 1}.</p>
                    </Col>
                    <Col md={2}>
                      <Image src={require(`../Components/Assets/Item_image/${cartItem.item_id}.png`)} fluid rounded />
                    </Col>
                    <Col md={5}>
                      <Link to={`/item/${cartItem.item_id}`}>
                        <p> {itemNames[cartItem.item_id]}</p>
                      </Link>
                    </Col>
                    <Col md={2}>
                      Quantity: {cartItem.quantity}
                    </Col>
                    <Col md={1}>
                      <Button type='button' variant='light'
                        onClick={() => removeFromCart(cartItem)}>
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>

          </div>
          <Row className="justify-content-end">
            <Col md={2}>
              <Link to='/order'>
              <Button disabled={(disputingItems.length > 0)}>Make Order</Button>
              </Link>
            </Col>
            <br/>
            <br/>
            <br/>
            {disputingItems.length > 0 && (
              <Alert variant="danger">
                <h6>Remove the following items to make order:</h6>
                {disputingItems.map((item, index) => (
                  <p key={index}>
                    {item.itemName}: In Cart - {item.cartQuantity}, In Inventory - {item.availableQuantity}
                  </p>
                ))}
              </Alert>
            )}

          </Row>
        </div>
      )}
    </Container>

  );
};

export default Cart;
