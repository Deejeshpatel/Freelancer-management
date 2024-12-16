import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css"; // Custom CSS for styling

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/auth/register", { username, email, password });
            alert("Registration successful!");
            navigate('/login');
        } catch (error) {
            console.error("Error registering");
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1 className="register-title">Create an Account</h1>
                {error && <p className="register-error">{error}</p>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Name</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
