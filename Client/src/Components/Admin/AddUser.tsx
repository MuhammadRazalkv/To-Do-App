import { FormEvent, useState } from 'react'
import '../../Pages/Login/Login.css'
import { Link, useNavigate } from 'react-router-dom'

const AddUser = () => {
  const token = localStorage.getItem('adminToken');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validateName = (name: string) => {
    if (name.trim().length < 4) {
      setNameError('Name must be at least 4 characters long ')
    } else {
      setNameError('')
    }
  }
  // Password validation
  const validatePassword = (password: string) => {
    if (password.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailError && !passwordError && !nameError) {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
           },
          body: JSON.stringify({
            name, email, password
          }),
        });
        const data = await res.json()
        if (res.ok) {
          setEmailError('')
          setNameError('')
          setPasswordError('')
          setError('')
          setSuccess('Successfully registered user redirecting to Home page ')
          setTimeout(() => {

            navigate('/admin/home')
          }, 3000)
        } else {
        setLoading(false);

          setError(data.error)
        }

      } catch (error) {
        setLoading(false);
        setError(error as string);
      }
    }
  };



  return (

    <div className="container">
      {success &&
        <div className="card-container">
          <div className="loader">
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
            <div className="circle">
              <div className="dot"></div>
              <div className="outline"></div>
            </div>
          </div>
        </div>
      }
      {!success &&
        <div className="login-form">
          <h1>Add user  </h1>
          {error && <span className="error">{error}</span>}

          <form onSubmit={handleSubmit} >
            <div className="input-group">
              <input
                type="text"
                id="text"
                name="name"
                placeholder="User name "
                required
                value={name}
                onChange={(e) => { setName(e.target.value); validateName(e.target.value) }}
              />
            </div>
            {nameError && <span className="error">{nameError}</span>}
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value) }}
              />
            </div>
            {emailError && <span className="error">{emailError}</span>}
            <div className="input-group">

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value) }}
              />
            </div>
            {passwordError && <span className="error">{passwordError}</span>}
            <button type="submit">
            {loading ? 'Submitting...' : 'Sign up'}
            </button>

          </form>
          <span >Already have an account <Link style={{ fontWeight: 500 }} to={'/login'} >Login</Link> </span>
        </div>
      }
    </div>
  )
}

export default AddUser
