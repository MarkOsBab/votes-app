import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import ChangeAdminPassword from './pages/ChangeAdminPassword';
import CreateVoter from './pages/CreateVoter';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/panel/change-password" element={<ChangeAdminPassword />} />
          <Route path="/admin/panel/add-voter" element={<CreateVoter />} />
        </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
