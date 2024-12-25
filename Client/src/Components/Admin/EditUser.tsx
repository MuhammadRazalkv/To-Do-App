import { useNavigate, useParams } from 'react-router-dom'
import '../../Pages/Profile/Profile.css'
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// interface User {
//   _id: number;
//   name: string | undefined;
//   email: string;
// }


const EditUser = () => {
  // const [user,setUser] = useState<User | null>(null);
  const token = localStorage.getItem('adminToken');
  const { id } = useParams()
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
       
        
        const response = await fetch(`http://localhost:3000/admin/getUser/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        // setUser(data);
        setName(data?.name)
        setEmail(data?.email)
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          // setError(error.message);
        } else {
          console.log("An unknown error occurred.");
        }

      } finally {
        // setLoading(false);
      }
    };

    fetchUser();
  }, [id,token])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(email) ? '' : 'Invalid email format');
  };

  const validateName = (name: string) => {
    setNameError(name.trim().length < 4 ? 'Name must be at least 4 characters long' : '');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (!emailError && !nameError) {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:3000/admin/editUser/${id}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name, email
          }),
        });
        const data = await res.json()
        if (res.ok) {
          setSuccess(data.success)
          setTimeout(() => {

            navigate('/admin/home')
          }, 1000)
        } else {
          setError(data?.error)
          setLoading(false)
        }

      } catch (error) {
        setLoading(false)
        console.log(error);
        if (error instanceof Error) {
          setError(error.message)
        }

      }
    }


  }


  return (
    <div className="container">
      <div className="login-form">
        <h1>Edit user </h1>

        <form onSubmit={handleSubmit}>
          {success && <span className="success">{success}</span>}
          {error && <span className="error">{error}</span>}

          <div className="input-group">
            <input
              type="text"
              id="text"
              name="name"
              placeholder="User name"
              value={name || ''}
              onChange={(e) => {
                validateName(e.target.value);
                setName(e.target.value);
              }}
            />
          </div>
          {nameError && <span className="error">{nameError}</span>}

          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email || ''}
              onChange={(e) => {
                validateEmail(e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>
          {emailError && <span className="error">{emailError}</span>}



          <button type="submit"

          >
            {loading ? 'Saving changes ...' : 'save'}

          </button>
          <Link to={'/admin/home'} className="btn btn-primary">
            Back to home
          </Link>
        </form>
      </div>
    </div>  
  )
}

export default EditUser 
