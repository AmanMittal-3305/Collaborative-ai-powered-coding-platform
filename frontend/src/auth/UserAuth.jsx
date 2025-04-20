import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!token || !user) {
                navigate('/login')
            } else {
                setLoading(false)
            }
        }, 500) // allow time for user context to populate

        return () => clearTimeout(timer)
    }, [token, user, navigate])

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.text}>Authenticating User...</p>
            </div>
        )
    }

    return <>{children}</>
}

const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    spinner: {
        width: '60px',
        height: '60px',
        border: '6px solid #ccc',
        borderTop: '6px solid #007BFF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    text: {
        marginTop: '20px',
        fontSize: '1.2rem',
        color: '#333',
    },
}

// Add global spinner animation
const styleSheet = document.styleSheets[0]
const keyframes =
    `@keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }`
styleSheet.insertRule(keyframes, styleSheet.cssRules.length)

export default UserAuth
