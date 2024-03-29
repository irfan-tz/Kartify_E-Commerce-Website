import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as Components from '../Components/Login/LoginSignUp.js';
import { LoginValidation, SignUpValidation } from '../Components/Processing/LoginValidation'

function Login () {
  
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const clearInputAndErrors = () => {
    setValues({
      name: '',
      email: '',
      phone: '',
      password: ''
    });
    setErrors({});
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (event.target.id === 'signup-form') {
      const { name, email, phone, password } = values;
      setErrors(SignUpValidation(name, email, phone, password));
    } else if (event.target.id === 'signin-form') {
      // For the login form, we create a subset of values that includes only email and password
      const { email, password } = values;
      setErrors(LoginValidation({ email, password }));
    }
  };  

  const [signIn, toggle] = React.useState(true);
  return (
    <div >
    <div className='d-flex justify-content-center align-items-center vh-100'>
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn} onClick={clearInputAndErrors}>
        <Components.Form id="signup-form" action="" onSubmit={handleSubmit}>
          <Components.Title>Create Account</Components.Title>
          <Components.Input type='text' placeholder='Name' />
          {errors.name && <span className='text-danger'>{errors.name}</span>}
          <Components.Input type='email' placeholder='Email' />
          {errors.email && <span className='text-danger'>{errors.email}</span>}
          <Components.Input type='tel' placeholder='Phone' />
          {errors.phone && <span className='text-danger'>{errors.phone}</span>}
          <Components.Input type='password' placeholder='Password' />
          {errors.password && <span className='text-danger'>{errors.password}</span>}
          <Components.Button>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn} onClick={clearInputAndErrors}>
        <Components.Form id="signin-form" action="" onSubmit={handleSubmit}>
          <Components.Title>Sign in</Components.Title>
          <Components.Input type='email' placeholder='Email' name='email' onChange={handleInput} className='form-control rounded-1'/>
          {errors.email && <span className='text-danger'>{errors.email}</span>}
          <Components.Input type='password' placeholder='Password' name='password' onChange={handleInput} className='form-control rounded-1'/>
          {errors.password && <span className='text-danger'>{errors.password}</span>}
          <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
          <Components.Button>Sign In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>

          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
            &gt;_&lt;
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Wanna kartify?</Components.Title>
              <Components.Paragraph>
                Have something on your mind? <br />Get it kartified 😉👍🏼
              </Components.Paragraph>
                <Components.GhostButton onClick={() => toggle(false)}>
                  Sign Up
                </Components.GhostButton> 
            </Components.RightOverlayPanel>

            </Components.Overlay>
        </Components.OverlayContainer>

    </Components.Container>
    </div>
    <div className='position-absolute top-0 end-0 m-3'>
  <Link to="/home" className='btn btn-default text-decoration-none'>&nbsp;Skip&gt;&gt;&nbsp;</Link>
</div>
    </div>
  )
}

export default Login