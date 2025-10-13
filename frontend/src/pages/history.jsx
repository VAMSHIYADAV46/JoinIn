import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const history = await getHistoryOfUser();
                
                // Fix: Handle different response structures
                if (Array.isArray(history)) {
                    setMeetings(history);
                } else if (history && Array.isArray(history.meetings)) {
                    setMeetings(history.meetings);
                } else if (history && history.data && Array.isArray(history.data.meetings)) {
                    setMeetings(history.data.meetings);
                } else {
                    setMeetings([]);
                }
                
                setError("");
            } catch (err) {
                console.error("Error fetching history:", err);
                setError("Failed to load meeting history");
                setMeetings([]);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    const handleJoinMeeting = (meetingCode) => {
        routeTo(`/${meetingCode}`);
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <style jsx="true">{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .meeting-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(8px);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                    opacity: 0;
                    animation: fadeInUp 0.6s forwards;
                }

                .meeting-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    background: rgba(255, 255, 255, 0.2);
                }

                .meeting-card:nth-child(1) { animation-delay: 0.1s; }
                .meeting-card:nth-child(2) { animation-delay: 0.2s; }
                .meeting-card:nth-child(3) { animation-delay: 0.3s; }
                .meeting-card:nth-child(4) { animation-delay: 0.4s; }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .nav-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .join-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    font-size: 14px;
                }

                .join-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* Navigation */}
            <nav
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 40px",
                    color: "white",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            margin: 0,
                            letterSpacing: "0.05em",
                        }}
                    >
                        Meeting History
                    </h1>
                </div>

                <button
                    className="nav-btn"
                    onClick={() => routeTo("/home")}
                >
                    <span>🏠</span>
                    Back to Home
                </button>
            </nav>

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    padding: "20px 40px 40px 40px",
                }}
            >
                <div
                    className="glass-card"
                    style={{
                        padding: "40px",
                        maxWidth: "1000px",
                        margin: "0 auto",
                        minHeight: "600px",
                    }}
                >
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "400px",
                                gap: "20px",
                            }}
                        >
                            <div className="loading-spinner"></div>
                            <p
                                style={{
                                    color: "rgba(255, 255, 255, 0.8)",
                                    fontSize: "16px",
                                    margin: 0,
                                }}
                            >
                                Loading your meeting history...
                            </p>
                        </div>
                    ) : error ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "400px",
                                gap: "20px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "48px",
                                    marginBottom: "16px",
                                }}
                            >
                                ⚠️
                            </div>
                            <h3
                                style={{
                                    color: "white",
                                    margin: 0,
                                    fontSize: "24px",
                                    textAlign: "center",
                                }}
                            >
                                {error}
                            </h3>
                            <button
                                className="nav-btn"
                                onClick={() => window.location.reload()}
                            >
                                🔄 Try Again
                            </button>
                        </div>
                    ) : meetings.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "400px",
                                gap: "20px",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "64px",
                                    marginBottom: "16px",
                                }}
                            >
                                📅
                            </div>
                            <h3
                                style={{
                                    color: "white",
                                    margin: 0,
                                    fontSize: "24px",
                                    textAlign: "center",
                                }}
                            >
                                No Meeting History
                            </h3>
                            <p
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    maxWidth: "400px",
                                    lineHeight: "1.5",
                                }}
                            >
                                You haven't joined any meetings yet. Start by creating or joining your first meeting!
                            </p>
                            <button
                                className="nav-btn"
                                onClick={() => routeTo("/home")}
                            >
                                ➕ Start Meeting
                            </button>
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    marginBottom: "32px",
                                    textAlign: "center",
                                }}
                            >
                                <h2
                                    style={{
                                        color: "white",
                                        fontSize: "32px",
                                        fontWeight: "300",
                                        margin: 0,
                                        marginBottom: "8px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Your Meetings
                                </h2>
                                <p
                                    style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        margin: 0,
                                        fontSize: "16px",
                                    }}
                                >
                                    {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} found
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {meetings.map((meeting, index) => (
                                    <div
                                        key={index}
                                        className="meeting-card"
                                        style={{
                                            padding: "24px",
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "8px",
                                                    background: "rgba(255, 255, 255, 0.2)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "18px",
                                                    marginRight: "12px",
                                                }}
                                            >
                                                🎥
                                            </div>
                                            <div>
                                                <h4
                                                    style={{
                                                        color: "white",
                                                        margin: 0,
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Meeting Code
                                                </h4>
                                                <p
                                                    style={{
                                                        color: "rgba(255, 255, 255, 0.8)",
                                                        margin: 0,
                                                        fontSize: "18px",
                                                        fontWeight: "500",
                                                        fontFamily: "monospace",
                                                    }}
                                                >
                                                    {meeting.meetingCode || meeting.meetingId || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        color: "rgba(255, 255, 255, 0.7)",
                                                        fontSize: "14px",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    📅 {formatDate(meeting.date || meeting.createdAt)}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "rgba(255, 255, 255, 0.7)",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    🕐 {formatTime(meeting.date || meeting.createdAt)}
                                                </div>
                                            </div>
                                            {meeting.isHost && (
                                                <div
                                                    style={{
                                                        background: "rgba(16, 185, 129, 0.2)",
                                                        color: "#6ee7b7",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    HOST
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            className="join-btn"
                                            onClick={() => handleJoinMeeting(meeting.meetingCode || meeting.meetingId)}
                                            style={{ width: "100%" }}
                                        >
                                            🚀 Join Again
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}