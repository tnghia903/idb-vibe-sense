import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Timer from '../components/Timer';
import { FaArrowLeft } from 'react-icons/fa';

const Settings = () => {
    const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || 'distance');

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        localStorage.setItem('sortBy', value);
    };

    return (
        <div className="container">
            <header style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xl)',
                paddingTop: 'var(--spacing-md)'
            }}>
                <Link
                    to="/"
                    style={{
                        marginRight: 'var(--spacing-md)',
                        fontSize: '1.2rem',
                        textDecoration: 'none',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    ←
                </Link>
                <h1 style={{ fontSize: '2rem' }}>Settings</h1>
            </header>
            <main>
                <section className="glass-card" style={{
                    padding: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '1.2rem' }}>Set a Timer</h2>
                    <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Wait for the perfect moment. We'll show you the spots when time is up.
                    </p>
                    <Timer />
                </section>

                <section className="glass-card" style={{
                    padding: 'var(--spacing-lg)'
                }}>
                    <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.2rem' }}>Preferences</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background 0.2s'
                        }}
                            className="preference-item"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value="distance"
                                checked={sortBy === 'distance'}
                                onChange={handleSortChange}
                                style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }}
                            />
                            <span style={{ fontWeight: 500 }}>Sort by Shortest Distance</span>
                        </label>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'background 0.2s'
                        }}
                            className="preference-item"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value="loved"
                                checked={sortBy === 'loved'}
                                onChange={handleSortChange}
                                style={{ accentColor: 'var(--color-primary)', width: '20px', height: '20px' }}
                            />
                            <span style={{ fontWeight: 500 }}>Prioritize Loved/Cozy Items</span>
                        </label>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Settings;
