import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';


const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // React Router hook for navigation

   

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (signupPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Something went wrong');
            } else {
                // Store username in localStorage after successful signup
                // localStorage.setItem('username', signupName);
                console.log('User registered successfully');
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('Error during signup. Please try again.');
        }
    };
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Something went wrong');
            } else {
                const data = await response.json();
                // Store username in localStorage after login
                localStorage.setItem('username', data.username); 
                console.log('Login successful');
                navigate('/');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Error during login. Please try again.');
        }
    };

    return (
        <div className="login-signup-container">
            {errorMessage && <span className="error-message">{errorMessage}</span>}
            {isLogin ? (
                <div className="form-container">
                    <h2>Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={() => setIsLogin(false)}>Sign Up</span>
                    </p>
                </div>
            ) : (
                <div className="form-container">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignupSubmit}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />


                        <button type="submit">Sign Up</button>
                    </form>
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setIsLogin(true)}>Login</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default LoginSignup;
