import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Set the isClient state to true when the component is mounted (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send credentials to the backend (NestJS API)
    const response = await fetch('http://localhost:4006/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
  
    if (data.success && data.access_token) {
      localStorage.setItem('access_token', data.access_token);

      if (data.role === "student") {
        if (isClient) window.location.href = '/studentDashboard'; 
      } else if (data.role === "instructor") {
        if (isClient) window.location.href = '/instructorDashboard'; 
      } else {
        if (isClient) window.location.href = '/adminDashboard'; 
      }

    } else {
      // Handle errors
      setError(data.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-pink-300 transition duration-200">Login</button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account? <Link href="/signup" className="text-black hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}
