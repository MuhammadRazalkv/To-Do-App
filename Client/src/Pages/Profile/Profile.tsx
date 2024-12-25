
import { useSelector, useDispatch } from 'react-redux';
import { FormEvent, useEffect, useState } from 'react';
import { RootState } from '../../Store';
import { Link, useNavigate } from 'react-router-dom';
import { updateUser, updateProfilePicture } from '../../auth/authSlice';
import { storage } from '../../firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage functions
import defaultUserImg from '../../assets/default-user.jpg'


const Profile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [emailError, setEmailError] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading,setLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(email) ? '' : 'Invalid email format');
  };

  const validateName = (name: string) => {
    setNameError(name.trim().length < 4 ? 'Name must be at least 4 characters long' : '');
  };
 

  useEffect(() => {
   
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setImagePreview(user.profilePicture || null);
     
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!emailError && !nameError) {
      setLoading(true)
      try {
        const token = localStorage.getItem("token");

        let profileImageUrl = null;

        if (profileImage) {
          const imageRef = ref(storage, `profileImages/${profileImage.name}`);
          await uploadBytes(imageRef, profileImage);
          profileImageUrl = await getDownloadURL(imageRef);
          
          // Dispatch the action to update the Redux state
          dispatch(updateProfilePicture(profileImageUrl));
        }

        const formData = {
          id: user?.id || '',
          name,
          email,
          profileImage: profileImageUrl
        };

        const res = await fetch("http://localhost:3000/updateProfile", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
          setError('');
          setEmailError('');
          setNameError('');
          setSuccess(data.success);
          dispatch(updateUser(data.user));
          // Update the local state with the new profile picture URL
          setImagePreview(profileImageUrl);
          setLoading(false)
          setTimeout(()=>{

            navigate(-1)
          },1500)
        } else {
          setSuccess('');
          setEmailError('');
          setNameError('');
          setError(data.error);
          setLoading(false)
        }

      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h1>Profile</h1>
        <img src={imagePreview || defaultUserImg} alt="Profile" style={{ width: 100, height: 100 , borderRadius : 50 , border:0  }} className="profile-img" />
        <form onSubmit={handleSubmit}>
          {success && <span className="success">{success}</span>}
          {error && <span className="error">{error}</span>}

          <div className="input-group">
            <input
              type="text"
              id="text"
              name="name"
              placeholder="User name"
              value={name}
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
              value={email}
              onChange={(e) => {
                validateEmail(e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>
          {emailError && <span className="error">{emailError}</span>}

          <div className="input-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <button type="submit">
            {loading ? 'Saving changes ...' : 'save'}
          </button>
          <Link to={'/'} className="btn btn-primary">
            Back to home
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Profile;
