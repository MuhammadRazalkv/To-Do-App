import { FormEvent, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    if (password.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (!emailError && !passwordError) {
  //     try {
  //       setLoading(true);
  //       const res = await fetch('http://localhost:3000/login', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ email, password }),
  //       });

  //       const data = await res.json();
  //       if (res.ok) {


  //         dispatch(loginSuccess({ token: data.token, user: data.user }));


  //         setEmailError('');
  //         setPasswordError('');
  //         setSuccess(data.message);
  //         setLoading(false);


  //         navigate('/');

  //       } else {
  //         setLoading(false);
  //         setError(data.error);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       setError(String(error));
  //     }
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailError && !passwordError) {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {

          const { token, user } = data;


          dispatch(loginSuccess({ token, user }));


          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));


          setSuccess(data.message);


          setEmailError('');
          setPasswordError('');


          navigate('/');

        } else {
          // Handle unsuccessful login
          setLoading(false);
          setError(data.error);
        }
      } catch (error) {
        // Handle any errors during the login process
        setLoading(false);
        setError(String(error));
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
          <h1>Login</h1>
          {error && <span className="error">{error}</span>}
          <form onSubmit={handleSubmit}>
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
              {loading ? 'Submitting...' : 'Login'}
            </button>

          </form>
          <span>Don't have an account <Link to={'/signup'}>Sign up </Link></span>
        </div>
      }
    </div>
  )
}

export default Login 
