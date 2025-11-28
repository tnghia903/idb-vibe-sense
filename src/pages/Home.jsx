import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaHeartBroken, FaHeart } from 'react-icons/fa';
import { LocationService } from '../services/locationService';
import { OverpassService } from '../services/overpassService';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permissionStatus, setPermissionStatus] = useState('unknown');
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const position = await LocationService.getCurrentPosition();
            setUserLocation(position);
            setPermissionStatus('granted');
            const data = await OverpassService.fetchRestaurants(position.lat, position.lon);
            setRestaurants(data);
        } catch (err) {
            console.error(err);
            if (err.message.includes('denied') || err.name === 'GeolocationPositionError') {
                setPermissionStatus('denied');
                const randomData = await OverpassService.fetchRandomRestaurants();
                setRestaurants(randomData);
            } else {
                setError('Failed to fetch restaurants. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSortedRestaurants = () => {
        const sortBy = localStorage.getItem('sortBy') || 'distance';
        const lovedItems = JSON.parse(localStorage.getItem('lovedRestaurants') || '[]');

        return [...restaurants].sort((a, b) => {
            if (sortBy === 'loved') {
                const aLoved = lovedItems.includes(a.id);
                const bLoved = lovedItems.includes(b.id);
                if (aLoved && !bLoved) return -1;
                if (!aLoved && bLoved) return 1;
            }

            // Secondary sort or default sort by distance
            if (userLocation) {
                const distA = calculateDistance(userLocation.lat, userLocation.lon, a.lat, a.lon);
                const distB = calculateDistance(userLocation.lat, userLocation.lon, b.lat, b.lon);
                return distA - distB;
            }
            return 0;
        });
    };

    const sortedRestaurants = getSortedRestaurants();

    return (
        <div className="container">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-md)'
            }}>
                <div>
                    <h1 style={{
                        color: 'var(--color-text-main)',
                        fontSize: '2rem',
                        marginBottom: '4px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                    }}>
                        Find Your<br />
                        <span style={{ color: 'var(--color-primary)' }}>Perfect Match</span>
                    </h1>
                </div>
                <Link
                    to="/settings"
                    style={{
                        fontSize: '1.2rem',
                        textDecoration: 'none',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <FaCog />
                </Link>
            </header>

            <main>
                {permissionStatus === 'denied' && (
                    <div className="glass-card" style={{
                        padding: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)',
                        borderLeft: '4px solid var(--color-accent)'
                    }}>
                        <strong style={{ display: 'block', marginBottom: '8px' }}>📍 Location Access Needed</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                            To find spots near you, please allow location access. Showing random romantic places for now.
                        </p>
                        <button
                            onClick={fetchData}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}><FaHeart /></div>
                        <p style={{ fontWeight: 500 }}>Finding love nearby...</p>
                    </div>
                ) : error ? (
                    <div style={{ color: 'var(--color-error)', textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                        {error}
                        <button onClick={fetchData} className="btn btn-secondary" style={{ marginTop: '16px' }}>Retry</button>
                    </div>
                ) : (
                    <div className="restaurant-list">
                        {sortedRestaurants.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--color-text-secondary)' }}><FaHeartBroken /></div>
                                <p style={{ color: 'var(--color-text-secondary)' }}>No romantic spots found nearby.</p>
                            </div>
                        ) : (
                            sortedRestaurants.map((restaurant) => {
                                const distance = userLocation
                                    ? calculateDistance(userLocation.lat, userLocation.lon, restaurant.lat, restaurant.lon)
                                    : null;
                                return (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={{ ...restaurant, distance }}
                                        userLocation={userLocation}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
