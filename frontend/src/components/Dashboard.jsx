import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import * as FileSaver from "file-saver";
import Papa from "papaparse";
import "./AdminDashboard.css"; // Add a custom CSS file for styling

function AdminDashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleDownloadCSV = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        FileSaver.saveAs(blob, "projects.csv");
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    setData(result.data);
                },
                header: true,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/projects");
                setData(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                setError("Failed to load data.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Freelancer</h1>
                <nav className="dashboard-nav">
                    <button onClick={() => handleNavigation("/addproject")}>Add Project</button>
                    <button onClick={() => handleNavigation("/projects")}>Projects</button>
                    <button onClick={() => handleNavigation("/payments")}>Payments</button>
                    <button onClick={() => handleNavigation("/")}>Dashboard</button>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </nav>
            </header>
            <main className="dashboard-main">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div>
                        <div className="dashboard-actions">
                            <label className="import-button">
                                Import CSV
                                <input type="file" accept=".csv" onChange={handleImportCSV} hidden />
                            </label>
                            <button className="export-button" onClick={handleDownloadCSV}>
                                Download CSV
                            </button>
                        </div>
                        <Outlet />
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;
