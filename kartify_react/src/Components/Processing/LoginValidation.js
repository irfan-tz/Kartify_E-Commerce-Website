export function LoginValidation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d) (?=.*[a-z]) (?=.*[A-Z]) [a-zA-Z0-9]{8,}$/
  
    if (values.email === "") {
      error.email = "Email must not be empty"
  
    } else if (!email_pattern.test(values.email)) {
  
      error.email = "Email doesn't match 😮"
  
    }
  
    if (values.password === "") {
      error.password = "Password must not be empty"
    } else if (!password_pattern.test(values.password)) {
      error.password = "Password didn't match 😔"
    }
  
    return error;
  }
  
  export function SignUpValidation(values) {
      let error = {}
      const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const password_pattern = /^(?=.*\d) (?=.*[a-z]) (?=.*[A-Z]) [a-zA-Z0-9]{8,}$/
    
      if (values.name === "") {
          error.name = "Name must not be empty"
      } else {
          error.name = ""
      }
  
      if (values.email === "") {
        error.email = "Email must not be empty"
    
      } else if (!email_pattern.test(values.email)) {
    
        error.email = "Email doesn't match 😮"
      }
  
      if (values.phone === "") {
          error.name = "Mobile number must not be empty"
      } else {
          error.name = ""
      }
    
      if (values.password === "") {
        error.password = "Password must not be empty"
      } else if (!password_pattern.test(values.password)) {
        error.password = "Password didn't match 😔"
      }
    
      return error;
    }
  