import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get('/api/analytics'); // Adjust the endpoint as necessary
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data: {error.message}</div>;

    return (
        <div>
            <h1>Analytics Dashboard</h1>
            <div>
                <h2>Booking Statistics</h2>
                <p>Total Bookings: {data.totalBookings}</p>
                <p>Bookings This Month: {data.bookingsThisMonth}</p>
                <p>Most Visited Museum: {data.mostVisitedMuseum}</p>
            </div>
            <div>
                <h2>User Engagement</h2>
                <p>Total Users: {data.totalUsers}</p>
                <p>Active Users: {data.activeUsers}</p>
            </div>
            <div>
                <h2>Feedback Summary</h2>
                <p>Positive Feedback: {data.positiveFeedback}</p>
                <p>Negative Feedback: {data.negativeFeedback}</p>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;