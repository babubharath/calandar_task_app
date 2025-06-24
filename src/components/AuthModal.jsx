// components/AuthModal.jsx
import React, { useState } from 'react';

const AuthModal = ({ onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (isSignUp) {
      if (users.find(u => u.email === form.email)) {
        alert('User already exists!');
        return;
      }
      users.push(form);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('loggedInUser', JSON.stringify(form));
      onLogin(form);
      onClose();
    } else {
      const user = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) return alert('Invalid credentials!');
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      onLogin(user);
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
        <form onSubmit={handleSubmit}>
          {isSignUp && <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />}
          <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit">{isSignUp ? 'Register' : 'Login'}</button>
        </form>
        <p onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AuthModal;
