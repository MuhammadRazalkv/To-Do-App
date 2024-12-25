import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store';
import { Link } from 'react-router-dom';
import { logout } from '../../auth/authSlice';
import './Home.css';
import { useState , useEffect } from 'react';
import defaultUserImg from '../../assets/default-user.jpg'

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [userImg,setUserImg] = useState('')
  useEffect(() => {
    if (user) {
        setUserImg(user.profilePicture || '');
    }
}, [user]);

  


  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="home-container">
      {user ?   
        <div className="welcome-box">
        <img src={userImg || defaultUserImg} alt="Profile" style={{ width: 100, height: 100 , borderRadius : 50  }} className="profile-img" />

          <h2>Welcome, {user.name}</h2>
          
          <Link to={'/profile'} className="btn btn-primary">
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      :
        <div className="login-box">
          <p>Please log in</p>
          <Link to={'/login'} className="btn btn-primary">Login</Link>
        </div>
      }
    </div>
  );
};

export default Home;
