import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Admin Pages
import AdminLogin from '../admin/pages/AdminLogin';
import Dashboard from '../admin/pages/Dashboard';
import MuseumsManagement from '../admin/pages/MuseumsManagement';
import NewsManagement from '../admin/pages/NewsManagement';
import UserManagement from '../admin/pages/UserManagement';
import AdminLayout from '../admin/components/layout/AdminLayout';

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated and is an admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route 
        path="/" 
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/museums" 
        element={
          <AdminRoute>
            <AdminLayout>
              <MuseumsManagement />
            </AdminLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/news" 
        element={
          <AdminRoute>
            <AdminLayout>
              <NewsManagement />
            </AdminLayout>
          </AdminRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <AdminRoute>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </AdminRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AdminRoutes;