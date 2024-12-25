import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
interface User {
    _id: number;
    name: string;
    email: string;
}

const AdminHomePage: React.FC = () => {
    const token = localStorage.getItem('adminToken');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
            console.log('token',token);
            
            try {
                const response = await fetch('http://localhost:3000/admin/users', {

                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                    setError(error.message);
                } else {
                    console.log("An unknown error occurred.");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleEdit = async (id: number | string) => {
        navigate(`/admin/editUser/${id}`)

    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/userDelete/${id}`, { method: 'DELETE' ,
               
                headers: { 
                  'Authorization': `Bearer ${token}`,
                 },
             });
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
            if (response.ok) {
                toast.success("User deleted successfully", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });

            } else {
                const result = await response.json();
                toast.error(result.error || "Failed to delete user"); // Show error toast
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error('Failed to delete user:', error);
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    // Function to handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
    }
    const logOut =  async () => {
        localStorage.removeItem("adminToken");
        navigate('/admin/login')
    }

    return (

        <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#bb86fc' }}>Admin Home Page</h1>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        padding: '10px',
                        margin: '20px 0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '300px'
                    }}
                />
                <Link to={'/admin/addUser'} style={addBtnStyle}> Add user</Link>
                <button style={logoutBtn} onClick={()=>{logOut() }} >Logout</button>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>Name</th>
                            <th style={tableHeaderStyle}>Email</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user._id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{index + 1}</td>
                                <td style={tableCellStyle}>{user.name}</td>
                                <td style={tableCellStyle}>{user.email}</td>
                                <td style={tableCellStyle}>
                                    <button style={editButtonStyle} onClick={() => handleEdit(user._id)}>Edit</button>
                                    <button style={deleteButtonStyle} onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

// Styling
const tableHeaderStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '2px solid #333',
    color: '#bb86fc',
    fontSize: '16px',
    textAlign: 'left',
};

const tableRowStyle: React.CSSProperties = {
    backgroundColor: '#1e1e1e',
};

const tableCellStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid #333',
};

const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#03dac6',
    color: '#121212',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
};

const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: 'rgb(171 24 50)',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
};
const logoutBtn: React.CSSProperties = {
    backgroundColor: 'rgb(171 24 50)',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft:'300px'
};

const addBtnStyle: React.CSSProperties = {
    textDecoration: 'none',
    backgroundColor: 'rgb(55 73 226))',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
};

export default AdminHomePage;
