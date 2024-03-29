import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, Form, Card, Alert} from 'react-bootstrap';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {login} from "../Components/Actions/userActions";
import Loader from '../Components/Loader';

function Login() {

    const navigate=useNavigate()
    const [email,setEmail] = useState("")
    const [pass1,setPass1] = useState("")
    const [message,setMessage] = useState("")
    const [show, changeshow] = useState("fa fa-eye-slash")     
    
    const dispatch = useDispatch()
    const userLogin = useSelector((state)=>state.userLogin)
    const {error, loading, userInfo} = userLogin;

    const location = useLocation();
    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(()=>{
        if(userInfo){
            navigate('/')
        }
    },[userInfo, redirect])

    const submitHandler=(e)=>{
        e.preventDefault()
        
        dispatch(login(email, pass1))
    };

    return (
        <>
        <Container className='mt-3'>
        <Row>
            <Col md={4}></Col>
            <Col md={4}>
                <Card>
                    <Card.Header as="h3" className='text-center bg-black text-light'>
                    Login
                    </Card.Header>
                    <Card.Body>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {loading && <Loader/>}
                    <Form onSubmit={submitHandler}>
                        
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="pass1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={pass1} onChange={(e)=>setPass1(e.target.value)} required/>
                        </Form.Group>
                        
                        <br/>
                        <div className="d-grid gap-2">
                            <Button className='btn btn-md btn-success' type="submit">Login</Button>
                        </div>
                    </Form>

                    <Row className='py-3'>
                        <Col>
                        Not a user? <Link to="/signup">Sign Up</Link>
                        </Col>
                    </Row>

                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}></Col>
        </Row>
        </Container>
        </>
    )
}

export default Login