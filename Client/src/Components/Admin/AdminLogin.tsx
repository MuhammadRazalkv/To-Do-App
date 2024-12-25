import { useNavigate } from 'react-router-dom';
import '../../Pages/Login/Login.css'
import { useState,FormEvent } from 'react';


const AdminLogin = () => {
   
    const navigate  = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');

  
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
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!emailError && !passwordError) {
        try {
          const res = await fetch('http://localhost:3000/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (res.ok) {
            // Save the token to localStorage
            localStorage.setItem('adminToken', data.adminToken);
    
            // Redirect to the protected admin home route
            navigate('/admin/home');
          } else {
            setError(data.error);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        return;
      }
    };
    


  return (
    <div>
        <div className="container">
     
     
        <div className="login-form">
          <h1>Admin Login</h1>
          {error && <span className="error">{error}</span>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
             
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
              
                onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value) }}
              />
            </div>
            {passwordError && <span className="error">{passwordError}</span>}
            <button type="submit">
              {/* {loading ? 'Submitting...' : 'Login'} */}
              Login 
            </button>

          </form>
       
        </div>
      
    </div>
      
    </div>
  )
}

export default AdminLogin
