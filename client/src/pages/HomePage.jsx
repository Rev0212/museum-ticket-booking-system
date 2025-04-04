import React, { useEffect, useState } from 'react';
import FeaturedMuseums from '../components/home/FeaturedMuseums';
import NewsSection from '../components/home/NewsSection';
import UpcomingEvents from '../components/home/UpcomingEvents';
import axios from 'axios';

const HomePage = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('/api/news');
                setNews(response.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

    return (
        <div>
            <FeaturedMuseums />
            <NewsSection news={news} />
            <UpcomingEvents />
        </div>
    );
};

export default HomePage;