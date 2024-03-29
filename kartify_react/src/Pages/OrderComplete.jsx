import React, { useState, useEffect } from 'react'
import NavBar from '../Components/NavBar/NavBar'
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const OrderComplete = () => {
    const location = useLocation();
    const data = location.state;
    console.log(data);
    const [responseData, setResponseData] = useState({});
    const [saveError, setSaveErrors] = useState('');

    const makeOrder = () => {
        axios.post('http://127.0.0.1:8000/makeOrder/', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const responded = response.data;
                console.log(responded);
                setResponseData(responded);
            })
            .catch(error => {
                console.log('caught like a hot diggity dog!');
                console.log(error);
                console.log(error.response.data.error);
                setSaveErrors(error.response.data.error)
                return (
                    <div>
                        <NavBar />
                        <div>Error: {error.response.data.error}! 😔</div>
                    </div>
                );
            });
    };


    useEffect(() => {
        makeOrder();
    }, []);

    if (!data) {
        return <div> <NavBar />Data is not available.</div>;
    }

    return (
        <div>
            <NavBar />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '50px' }}>
                {saveError === '' ? (
                    <>
                        <h1 style={{ textAlign: 'center' }}>Order successful! 🤗</h1>
                        <h3 style={{ textAlign: 'center' }}>Order no. {responseData.order_id}</h3>
                        <h3>Your order will arrive in 5-6 working days.🚚</h3>
                    </>
                ) : (
                    <>
                        <h1 style={{ textAlign: 'center' }}>Order failed. 😔</h1>
                        <h3 style={{ textAlign: 'center' }}>{saveError}</h3>
                    </>
                )}
            </div>

            <Row className="justify-content-end">
                <Col md={2}>
                    <Link to="/" className="btn btn-dark my-3">
                        Go Back to Shop
                    </Link>
                </Col>
            </Row>
        </div>
    );
};

export default OrderComplete;