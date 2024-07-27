import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/panel/*" element={<AdminPanel />} />
        </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
