import React, { useState, useEffect, useMemo } from 'react';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaDirections } from 'react-icons/fa';

const UNSPLASH_IMAGES = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant interior
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', // Cozy bar
    'https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&q=80', // Cocktails
    'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80', // Dinner table
    'https://images.unsplash.com/photo-1551632436-cbf8dd354ca8?w=800&q=80', // Cozy cafe
    'https://images.unsplash.com/photo-1466978913421-dad938667119?w=800&q=80', // Food
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', // Restaurant
    'https://images.unsplash.com/photo-1578474843222-9593bc88d8dd?w=800&q=80', // Romantic dinner
    'https://images.unsplash.com/photo-1519671482538-518b5c2a9d22?w=800&q=80', // Outdoor seating
    'https://images.unsplash.com/photo-1554679665-f5537f187268?w=800&q=80', // Cafe vibe
];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'; // Reliable default

const RestaurantCard = ({ restaurant, userLocation }) => {
    const [isLoved, setIsLoved] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const lovedItems = JSON.parse(localStorage.getItem('lovedRestaurants') || '[]');
        setIsLoved(lovedItems.includes(restaurant.id));
    }, [restaurant.id]);

    const coverImage = useMemo(() => {
        if (imageError) return DEFAULT_IMAGE;
        if (restaurant.image) return restaurant.image;

        // Deterministic random image based on restaurant ID
        const charCodeSum = String(restaurant.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return UNSPLASH_IMAGES[charCodeSum % UNSPLASH_IMAGES.length];
    }, [restaurant.id, restaurant.image, imageError]);

    const toggleLove = () => {
        const lovedItems = JSON.parse(localStorage.getItem('lovedRestaurants') || '[]');
        let newLovedItems;
        if (isLoved) {
            newLovedItems = lovedItems.filter(id => id !== restaurant.id);
        } else {
            newLovedItems = [...lovedItems, restaurant.id];
        }
        localStorage.setItem('lovedRestaurants', JSON.stringify(newLovedItems));
        setIsLoved(!isLoved);
    };

    const handleNavigate = () => {
        let url = `https://www.openstreetmap.org/directions?to=${restaurant.lat},${restaurant.lon}`;
        if (userLocation) {
            url += `&from=${userLocation.lat},${userLocation.lon}`;
        }
        window.open(url, '_blank');
    };

    return (
        <div
            className="glass-card"
            style={{
                padding: '0',
                marginBottom: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition-normal)',
                position: 'relative',
                overflow: 'hidden',
                height: '400px'
            }}
        >
            <div style={{
                height: '65%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <img
                    src={coverImage}
                    alt={restaurant.name}
                    onError={() => setImageError(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%, rgba(0,0,0,0.8))',
                    pointerEvents: 'none'
                }} />

                <button
                    onClick={toggleLove}
                    style={{
                        position: 'absolute',
                        top: 'var(--spacing-md)',
                        right: 'var(--spacing-md)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: isLoved ? 'var(--color-primary)' : 'white',
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        zIndex: 2,
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isLoved ? <FaHeart /> : <FaRegHeart />}
                </button>
            </div>

            <div style={{
                padding: 'var(--spacing-md)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--color-surface)',
                position: 'relative',
                zIndex: 1
            }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{
                            margin: 0,
                            color: 'var(--color-text-main)',
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            lineHeight: 1.2
                        }}>
                            {restaurant.name}
                        </h3>
                        <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-primary)',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            marginLeft: '8px',
                            backgroundColor: 'rgba(255, 75, 43, 0.1)',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <FaMapMarkerAlt style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                            {restaurant.distance ? `${restaurant.distance.toFixed(1)} km` : restaurant.type}
                        </span>
                    </div>

                    {restaurant.tags && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                            {Object.entries(restaurant.tags)
                                .filter(([key]) => ['cuisine', 'atmosphere', 'view'].includes(key))
                                .map(([key, value]) => (
                                    <span key={key} style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-secondary)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        padding: '4px 10px',
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {value}
                                    </span>
                                ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleNavigate}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: 'var(--spacing-md)',
                        padding: '10px'
                    }}
                >
                    <FaDirections />
                    <span>Get Directions</span>
                </button>
            </div>
        </div>
    );
};

export default RestaurantCard;
