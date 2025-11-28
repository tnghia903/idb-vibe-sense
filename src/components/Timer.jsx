import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Timer = () => {
    const [duration, setDuration] = useState(0); // in seconds
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            // Timer finished
            navigate('/');
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, navigate]);

    const startTimer = (minutes) => {
        const seconds = minutes * 60;
        setDuration(seconds);
        setTimeLeft(seconds);
        setIsActive(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            {!isActive ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--spacing-md)'
                }}>
                    {[10, 20, 30].map((min) => (
                        <button
                            key={min}
                            onClick={() => startTimer(min)}
                            className="btn btn-secondary"
                            style={{
                                padding: 'var(--spacing-md)',
                                fontSize: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--color-text-main)'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}><FaClock /></span>
                            {min} min
                        </button>
                    ))}
                </div>
            ) : (
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{
                        fontSize: '4rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-lg)',
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: '0 0 20px rgba(255, 75, 43, 0.5)'
                    }}>
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => setIsActive(false)}
                        className="btn btn-secondary"
                        style={{
                            fontSize: '1rem',
                            padding: '12px 32px',
                            color: 'var(--color-text-main)',
                            borderColor: 'rgba(255,255,255,0.2)',
                            background: 'transparent'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Timer;
