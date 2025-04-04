import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get('/api/analytics'); // Adjust the endpoint as needed
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
            {/* Render your analytics data here */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default AnalyticsPage;