
import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';


export  const AdminProtected :  React.FC = () => {
  const token = localStorage.getItem('adminToken');
  return token ? <Outlet /> : <Navigate to="/admin/login" />
};

