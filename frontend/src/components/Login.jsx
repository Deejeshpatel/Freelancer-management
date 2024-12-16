import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css"; // Custom CSS file for styling

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            alert("Login successful!");
            navigate('/');
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Sign In</h1>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
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
                                name="password"
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
                    <button type="submit" className="login-button">Log In</button>
                </form>
                <p className="signup-link">
                    Don’t have an account? <a href="/register">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
