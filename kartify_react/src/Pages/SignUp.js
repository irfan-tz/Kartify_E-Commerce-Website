import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button, Form, Card, Alert} from 'react-bootstrap';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {signup} from "../Components/Actions/userActions";
import Loader from '../Components/Loader';

function SignUp() {

    const navigate=useNavigate()
    const [fname,setFname] = useState("")
    const [email,setEmail] = useState("")
    const [pass1,setPass1] = useState("")
    const [pass2,setPass2] = useState("")
    const [message,setMessage] = useState("")
    const dispatch = useDispatch();
    const location = useLocation();
    const redirect = location.search?location.search.split("=")[1] : "/"
    
    const userSignUp = useSelector((state)=>state.userSignUp);
    const {error,loading,userInfo} = userSignUp;

    useEffect(()=>{
        if(userInfo){
            navigate("/")
        }
    },[userInfo, redirect])

    const validEmail = new RegExp(
        '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9]+.[a-zA-Z]$'
      );
      
    const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
      
    const submitHandler=(e)=>{
        e.preventDefault()
        
        if (pass1 !== pass2 ) {
            setMessage("Passwords do not match 😤")
            navigate("/signup")
        }
        // else if (!validEmail.test(email)){
        //     setMessage("Invalid email format 😤")
        // }
        else if (!validPassword.test(pass1)){
            setMessage("Password rules not followed 😤")
        }
        else {
           dispatch(signup(fname, email, pass1)) 
           setMessage("Signup successful!")
           navigate("/login")
        }
    }

    return (
        <>
        <Container className='mt-3'>
        <Row>
            <Col md={4}></Col>
            <Col md={4}>
                <Card>
                    <Card.Header as="h3" className='text-center bg-black text-light'>
                    Sign Up
                    </Card.Header>
                    <Card.Body>
                    {error && <Alert variant='danger'>{error}</Alert>}
                    {loading && <Loader/>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="fname">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={fname} onChange={(e)=>setFname(e.target.value)} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="pass1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" value={pass1} onChange={(e)=>setPass1(e.target.value)} required/>
                            <Form.Text className="text-muted">
                                Password must include atleast one numeric, one lowercase alphabet, one uppercase alphabet, one special character and atleast 6 characters
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="pass2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" value={pass2} onChange={(e)=>setPass2(e.target.value)} required/>
                        </Form.Group>
                        <br/>
                        <div className="d-grid gap-2">
                            <Button className='btn btn-md btn-success' type="submit">Sign Up</Button>
                        </div>
                    </Form>

                    <Row className='py-3'>
                        <Col>
                        Already User? <Link to="/login">Login</Link>
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

export default SignUp