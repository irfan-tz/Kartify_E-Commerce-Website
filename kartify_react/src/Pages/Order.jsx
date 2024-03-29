import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar/NavBar';
import { Col, Row, ListGroup, Image, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Order() {

    const nav = useNavigate();
    const [formData, setFormData] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };


    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [cartItems, setCartItems] = useState([]);
    const [itemNames, setItemNames] = useState({});
    const [itemPrice, setItemPrice] = useState({});
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [dataToSend, setDataToSend] = useState({});

    const fetchCartItems = async () => {
        try {
            if (userInfo) {
                const response = await axios.get(`/getCartItems/${userInfo.email}`);
                setCartItems(response.data);
                const itemNamesData = {};
                const itemPricesData = {};
                let total = 0.00;
                for (const cartItem of response.data) {
                    const itemResponse = await axios.get(`/item/${cartItem.item_id}`);
                    itemNamesData[cartItem.item_id] = itemResponse.data.item_name;
                    itemPricesData[cartItem.item_id] = itemResponse.data.item_price;
                    const totalPriceForItem = parseFloat(itemResponse.data.item_price) * parseInt(cartItem.quantity);
                    total += totalPriceForItem;
                }
                setTotalPrice(total);
                setItemNames(itemNamesData);
                setItemPrice(itemPricesData);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [userInfo]);

    useEffect(() => {
        if (userInfo) {
            const send = {
                c_email: userInfo.email,
                items: cartItems.map(item => ({
                    item_id: item.item_id,
                    quantity: item.quantity
                })),
                total_price: totalPrice,
                address: formData.address,
                age: formData.age,
                pincode: formData.pincode,
                phone_num: formData.phone_num
            };
            setDataToSend(send);
        }
    }, [userInfo, formData]);

    const handleYesButtonClick = () => {
        setShowConfirmation(false);
        nav('/orderComplete', { state: dataToSend });
    };

    return (
        <>
            <NavBar />
            <div>
                <Row><br /></Row>
                <Row>
                    <Col md={1}> </Col>
                    <Col md={5}>
                        <h2>Fill out the form </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row" style={{ marginTop: '30px' }}>
                                <label className="col-md-3">Address:</label>
                                <div className="col-md-8">
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                        rows={2} // Set the number of rows to 2
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mb-3 row"> {/* Add row class */}
                                <label className="col-md-3">Phone Number:</label> {/* Specify column size for label */}
                                <div className="col-md-8"> {/* Specify column size for input */}
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row"> {/* Add row class */}
                                <label className="col-md-3">Age:</label> {/* Specify column size for label */}
                                <div className="col-md-8"> {/* Specify column size for input */}
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="5"
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row"> {/* Add row class */}
                                <label className="col-md-3">Pincode:</label> {/* Specify column size for label */}
                                <div className="col-md-8"> {/* Specify column size for input */}
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        pattern="[0-9]{6}"
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </form>
                    </Col>
                    <Col md={6}>
                        <h6><br />Items in your cart:</h6>
                        <ListGroup variant='flush'>
                            {cartItems.map((cartItem, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <p>{index + 1}.</p>
                                        </Col>
                                        <Col md={3}>
                                            <Image src={require(`../Components/Assets/Item_image/${cartItem.item_id}.png`)} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/item/${cartItem.item_id}`}>
                                                <p> {itemNames[cartItem.item_id]}</p>
                                            </Link>
                                        </Col>
                                        <Col md={2}>
                                            {itemPrice[cartItem.item_id]}
                                        </Col>
                                        <Col md={1}>
                                            x{cartItem.quantity}
                                        </Col>
                                        <Col md={1}>
                                            {(itemPrice[cartItem.item_id] * cartItem.quantity).toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Row>
                        <Col md={8}></Col>
                        <Col md={3}>Total Price: </Col>
                        <Col md={1}>{totalPrice}</Col>
                    </Row>
                </Row>
                <Row className="justify-content-end">
                    <Col md={2}>
                        <br />

                        <Button disabled={Object.keys(formData).length !== 4 || userInfo === undefined} onClick={() => setShowConfirmation(true)}>
                            Place Order
                        </Button>
                    </Col>
                </Row>
            </div>
            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>Make payment for $ {totalPrice}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleYesButtonClick}>
                        Yes!
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}