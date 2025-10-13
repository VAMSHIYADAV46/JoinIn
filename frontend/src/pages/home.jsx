import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        // Validate meeting code
        if (!meetingCode || meetingCode.trim() === "") {
            setError("Please enter a meeting code");
            return;
        }

        try {
            setIsLoading(true);
            setError("");
            setSuccess("");
            
            // Add to history only if meeting code is valid
            const result = await addToUserHistory(meetingCode.trim());
            
            if (result && result.success) {
                setSuccess("Successfully joined meeting!");
                // Navigate to the meeting room after a brief delay
                setTimeout(() => {
                    navigate(`/${meetingCode.trim()}`);
                }, 1000);
            } else {
                setError("Failed to join meeting. Please try again.");
            }
        } catch (err) {
            console.error("Error joining meeting:", err);
            let errorMessage = "Failed to join meeting. Please try again.";
            
            // Handle specific error cases
            if (err.response) {
                errorMessage = err.response.data.message || errorMessage;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle Enter key press in the text field
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isLoading) {
            handleJoinVideoCall();
        }
    }

    const generateMeetingCode = () => {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setMeetingCode(newCode);
        setError("");
        setSuccess("");
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
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
                .home-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    position: relative;
                    overflow: hidden;
                    border: none;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                    border-radius: 8px;
                }
                
                .home-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
                }
                
                .home-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .home-btn::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.3),
                        transparent
                    );
                    transition: left 0.5s;
                }
                
                .home-btn:hover::before {
                    left: 100%;
                }

                .input-field {
                    display: block;
                    width: 100%;
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 16px 16px 16px 48px;
                    font-size: 16px;
                    outline: none;
                    transition: all 0.2s;
                    backdrop-filter: blur(8px);
                }

                .input-field:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    background-color: rgba(255, 255, 255, 0.95);
                }

                .input-field:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .icon-left {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: #9ca3af;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .feature-card {
                    opacity: 0;
                    animation: slideInUp 0.6s forwards;
                }

                .feature-card:nth-child(1) { animation-delay: 0.1s; }
                .feature-card:nth-child(2) { animation-delay: 0.2s; }
                .feature-card:nth-child(3) { animation-delay: 0.3s; }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
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
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                    backdrop-filter: blur(8px);
                }

                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
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
                        JoinIn
                    </h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <button
                        className="nav-btn"
                        onClick={() => navigate("/history")}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                        <span>📚</span>
                        History
                    </button>
                    <button className="nav-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                }}
            >
                <div
                    className="glass-card"
                    style={{
                        width: "100%",
                        maxWidth: "1200px",
                        padding: "60px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "80px",
                        alignItems: "center",
                    }}
                >
                    {/* Left Panel - Content */}
                    <div>
                        <h1
                            style={{
                                fontSize: "48px",
                                fontWeight: "500",
                                lineHeight: "1.1",
                                marginBottom: "24px",
                                color: "white",
                                textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            Providing Quality Video Call Just Like Quality Life
                        </h1>
                        
                        <p
                            style={{
                                fontSize: "20px",
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: "48px",
                                lineHeight: "1.6",
                            }}
                        >
                            Connect with people around the world through seamless video meetings
                        </p>

                        {/* Feature Cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {[
                                { icon: "🎥", title: "HD Video Quality", desc: "Crystal clear meetings" },
                                { icon: "🚀", title: "Instant Join", desc: "No downloads required" },
                                { icon: "🔐", title: "Secure & Private", desc: "End-to-end encryption" }
                            ].map(({ icon, title, desc }, i) => (
                                <div
                                    key={i}
                                    className="feature-card"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px",
                                        background: "rgba(255, 255, 255, 0.1)",
                                        borderRadius: "12px",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "24px",
                                            marginRight: "16px",
                                            width: "40px",
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(255, 255, 255, 0.2)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <div>
                                        <h3
                                            style={{
                                                color: "white",
                                                margin: 0,
                                                fontSize: "18px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {title}
                                        </h3>
                                        <p
                                            style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                margin: 0,
                                                fontSize: "14px",
                                            }}
                                        >
                                            {desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Meeting Form */}
                    <div
                        className="glass-card"
                        style={{
                            padding: "48px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "32px",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <h2
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "300",
                                    color: "white",
                                    margin: 0,
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                Join Meeting
                            </h2>
                            <p
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    margin: 0,
                                    fontSize: "16px",
                                }}
                            >
                                Enter a meeting code or generate a new one
                            </p>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div
                                style={{
                                    background: "rgba(239, 68, 68, 0.1)",
                                    border: "1px solid rgba(239, 68, 68, 0.3)",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    color: "#fca5a5",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>{error}</span>
                                <button
                                    onClick={() => setError("")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#fca5a5",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {success && (
                            <div
                                style={{
                                    background: "rgba(16, 185, 129, 0.1)",
                                    border: "1px solid rgba(16, 185, 129, 0.3)",
                                    borderRadius: "8px",
                                    padding: "16px",
                                    color: "#6ee7b7",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>{success}</span>
                                <button
                                    onClick={() => setSuccess("")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#6ee7b7",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Meeting Code Input */}
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "12px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "rgba(255, 255, 255, 0.9)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.025em",
                                }}
                            >
                                Meeting Code
                            </label>
                            <div style={{ position: "relative" }}>
                                <div className="icon-left">🎯</div>
                                <input
                                    type="text"
                                    value={meetingCode}
                                    onChange={(e) => {
                                        setMeetingCode(e.target.value);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className="input-field"
                                    placeholder="Enter or generate a meeting code"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <button
                                onClick={handleJoinVideoCall}
                                className="home-btn"
                                disabled={isLoading || !meetingCode.trim()}
                                style={{
                                    padding: "16px 24px",
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span>⏳</span>
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        Join Meeting
                                    </>
                                )}
                            </button>

                            <button
                                onClick={generateMeetingCode}
                                disabled={isLoading}
                                style={{
                                    padding: "12px 24px",
                                    fontSize: "14px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid rgba(255, 255, 255, 0.3)",
                                    borderRadius: "8px",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                    fontWeight: "500",
                                    backdropFilter: "blur(8px)",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = "rgba(255, 255, 255, 0.2)";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = "rgba(255, 255, 255, 0.1)";
                                }}
                            >
                                ✨ Generate Meeting Code
                            </button>
                        </div>

                        <div
                            style={{
                                textAlign: "center",
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.6)",
                            }}
                        >
                            Join instantly without any downloads or plugins
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(HomeComponent)