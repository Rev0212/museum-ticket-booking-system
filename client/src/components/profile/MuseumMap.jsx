import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MuseumMap = ({ location }) => {
    const mapStyles = {
        height: "400px",
        width: "100%"
    };

    const defaultCenter = {
        lat: location.lat,
        lng: location.lng
    };

    return (
        <LoadScript
            googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" // Replace with your Google Maps API key
        >
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={15}
                center={defaultCenter}
            >
                <Marker position={defaultCenter} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MuseumMap;