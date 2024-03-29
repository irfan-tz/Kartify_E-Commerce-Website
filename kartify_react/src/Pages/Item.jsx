import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar/NavBar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { Container, Row, Col, Image, Button, Alert } from 'react-bootstrap';

export default function Item({ params }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams()
  const [item, setItem] = useState([]);
  const [itemImage, setItemImage] = useState([]);
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin;

  useEffect(() => {
    async function fetchItem() {
      const { data } = await axios.get(`/item/${id}`);
      setItem(data);
      const image = await import(`../Components/Assets/Item_image/${data.item_id}.png`);
      setItemImage(image.default);
    }
    fetchItem();
  }, []);

  const addToCartHandler = async () => {
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/addToCart/', {
        c_email: userInfo.email,
        item_id: item.item_id,
        quantity: 1,
        total_price : item.item_price
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
      // Redirect the user to the cart page or show a success message
      navigate('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Handle error: show an error message or redirect to an error page
    }
  }

  return (
    <Container>
      <div className="Item">
        <h1>
          <NavBar />
        </h1>
        <Link to="/" className="btn btn-dark my-3">
          Go Back
        </Link>
        <Row>
          <Col md={1}></Col>
          <Col md={4}>
            <Image src={itemImage} alt={item.item_name} fluid />
          </Col>
          <Col md={6}>
            <h2>{item.item_name ? item.item_name.toUpperCase() : ''}</h2>

            <p>Price: {item.item_price}</p>
            <div className="text-danger">{item.quantity > 0 ? item.quantity==1 ? "Only single item left!" : "Limited stock, order fast!"  : "Out of Stock"}</div>
            <p><br/>{item.description}</p>
            <Button className='btn-block' disabled={item.quantity == 0} type='button' onClick={addToCartHandler}>Add to Cart</Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}