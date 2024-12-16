import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api';
import './Chart.css'; // Custom CSS file for styling

function Chart() {
    const [chartData, setChartData] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [completedProjectCount, setCompletedProjectCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [earningsData, setEarningsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const projectsResponse = await api.get('/api/projects');
                const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];

                const activeProjects = projects.filter(project => project.status === 'Active').length;
                const completedProjects = projects.filter(project => project.status === 'Completed').length;

                setProjectCount(activeProjects);
                setCompletedProjectCount(completedProjects);

                const paymentsResponse = await api.get('/api/payments/pay');
                const payments = Array.isArray(paymentsResponse.data.payment) ? paymentsResponse.data.payment : [];

                setPaymentCount(payments.length);

                const earnings = calculateMonthlyEarnings(payments);
                setEarningsData(earnings);

                const newChartData = [
                    { name: 'Active Projects', value: activeProjects },
                    { name: 'Completed Projects', value: completedProjects },
                ];
                setChartData(newChartData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setError("Unable to load dashboard data at this time.");
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const calculateMonthlyEarnings = (payments) => {
        const earnings = [];
        const currentDate = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < 12; i++) {
            earnings.push({ month: months[(currentDate.getMonth() - i + 12) % 12], earnings: 0 });
        }

        payments.forEach(payment => {
            const paymentDate = new Date(payment.date);
            const monthIndex = (currentDate.getMonth() - paymentDate.getMonth() + 12) % 12;
            earnings[monthIndex].earnings += payment.amount;
        });

        return earnings.reverse();
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Analytics Dashboard</h1>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <>
                    <div className="stats-cards">
                        <div className="stats-card">
                            <p className="stats-label">Active Projects</p>
                            <h2 className="stats-value">{projectCount}</h2>
                        </div>
                        <div className="stats-card">
                            <p className="stats-label">Processed Payments</p>
                            <h2 className="stats-value">{paymentCount}</h2>
                        </div>
                        <div className="stats-card">
                            <p className="stats-label">Completed Projects</p>
                            <h2 className="stats-value">{completedProjectCount}</h2>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h2 className="chart-title">Monthly Earnings</h2>
                        {earningsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="earnings" fill="#007BFF" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data-message">No earnings data available to display.</p>
                        )}
                    </div>

                    <div className="chart-container">
                        <h2 className="chart-title">Comparative Analysis</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#28A745" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data-message">No data available to display.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Chart;
