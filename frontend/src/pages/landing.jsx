import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6366f1 100%)",
            overflow: "hidden",
            position: "relative"
        }}>
            <style jsx="true">{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                * {
                    font-family: 'Inter', sans-serif;
                }

                .hero-btn {
                    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
                    border: none;
                    color: white;
                    padding: 16px 32px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .hero-btn:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 20px 40px rgba(245, 158, 11, 0.4);
                }

                .hero-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.5s;
                }

                .hero-btn:hover::before {
                    left: 100%;
                }

                .nav-btn {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-2px);
                }

                .login-btn {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 24px;
                    text-align: center;
                    transition: all 0.3s;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: slideUp 0.8s ease-out forwards;
                }

                .feature-card:nth-child(1) { animation-delay: 0.2s; }
                .feature-card:nth-child(2) { animation-delay: 0.4s; }
                .feature-card:nth-child(3) { animation-delay: 0.6s; }

                .feature-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    background: rgba(255, 255, 255, 0.15);
                }

                .floating-shapes {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 1;
                }

                .shape {
                    position: absolute;
                    opacity: 0.1;
                    animation: float 6s ease-in-out infinite;
                }

                .shape:nth-child(1) {
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape:nth-child(2) {
                    top: 60%;
                    left: 80%;
                    animation-delay: 2s;
                }

                .shape:nth-child(3) {
                    top: 80%;
                    left: 20%;
                    animation-delay: 4s;
                }

                .hero-text {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: slideUp 1s ease-out forwards;
                    animation-delay: 0.3s;
                }

                .hero-image {
                    opacity: 0;
                    transform: translateX(50px);
                    animation: slideLeft 1s ease-out forwards;
                    animation-delay: 0.6s;
                }

                @keyframes slideUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideLeft {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }

                .pulse {
                    animation: pulse 2s ease-in-out infinite;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #f59e0b, #f97316, #ef4444);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease infinite;
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @media (max-width: 768px) {
                    .hero-container {
                        flex-direction: column;
                        text-align: center;
                        padding: 20px;
                    }
                    
                    .hero-text h1 {
                        font-size: 48px !important;
                    }
                }
            `}</style>

            {/* Floating Background Shapes */}
            <div className="floating-shapes">
                <div className="shape" style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)"
                }}></div>
                <div className="shape" style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: "rgba(245, 158, 11, 0.2)"
                }}></div>
                <div className="shape" style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.2)"
                }}></div>
            </div>

            {/* Navigation */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 40px",
                position: "relative",
                zIndex: 10
            }}>
                <div style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "white",
                    letterSpacing: "-0.02em"
                }}>
                    JoinIn
                </div>
                
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                }}>
                    <button 
                        className="nav-btn"
                        onClick={() => router("/aljk23")}
                    >
                        Join as Guest
                    </button>
                    <button 
                        className="nav-btn"
                        onClick={() => router("/auth")}
                    >
                        Register
                    </button>
                    <button 
                        className="login-btn"
                        onClick={() => router("/auth")}
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="hero-container" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "60px 40px",
                position: "relative",
                zIndex: 10,
                minHeight: "calc(100vh - 120px)"
            }}>
                <div className="hero-text" style={{ flex: 1, maxWidth: "600px" }}>
                    <div style={{
                        display: "inline-block",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "50px",
                        padding: "8px 20px",
                        marginBottom: "24px",
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>
                        🎉 Now with HD video quality & screen sharing
                    </div>

                    <h1 style={{
                        fontSize: "72px",
                        fontWeight: "800",
                        lineHeight: "1.1",
                        marginBottom: "24px",
                        color: "white",
                        textShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                    }}>
                        <span className="gradient-text">Connect</span> with your loved ones{" "}
                        <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>seamlessly</span>
                    </h1>

                    <p style={{
                        fontSize: "24px",
                        color: "rgba(255, 255, 255, 0.8)",
                        marginBottom: "40px",
                        lineHeight: "1.6",
                        fontWeight: "300"
                    }}>
                        Experience crystal-clear video calls with friends, family, and colleagues. 
                        No downloads required, just instant connections.
                    </p>

                    <div style={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        marginBottom: "48px"
                    }}>
                        <Link to="/auth" className="hero-btn">
                            Get Started Free
                            <span>→</span>
                        </Link>
                        
                        <button 
                            onClick={() => router("/aljk23")}
                            style={{
                                background: "transparent",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                color: "white",
                                padding: "16px 32px",
                                borderRadius: "50px",
                                fontSize: "18px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                backdropFilter: "blur(10px)"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = "transparent";
                                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                            }}
                        >
                            Try Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: "flex",
                        gap: "40px",
                        marginTop: "40px"
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#f59e0b",
                                marginBottom: "4px"
                            }}>1K+</div>
                            <div style={{
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontWeight: "500"
                            }}>Happy Users</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#10b981",
                                marginBottom: "4px"
                            }}>99.9%</div>
                            <div style={{
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontWeight: "500"
                            }}>Uptime</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#6366f1",
                                marginBottom: "4px"
                            }}>0ms</div>
                            <div style={{
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontWeight: "500"
                            }}>Latency</div>
                        </div>
                    </div>
                </div>

                <div className="hero-image" style={{ 
                    flex: 1, 
                    textAlign: "center",
                    position: "relative"
                }}>
                    <div style={{
                        position: "relative",
                        display: "inline-block"
                    }}>
                        {/* Glowing effect behind image */}
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "120%",
                            height: "120%",
                            background: "radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent)",
                            borderRadius: "50%",
                            filter: "blur(40px)",
                            zIndex: -1
                        }} className="pulse"></div>

                        <img 
                            src="/mobile.png" 
                            alt="JoinIn Mobile App"
                            style={{
                                maxWidth: "500px",
                                width: "100%",
                                height: "auto",
                                filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.2))",
                                transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{
                padding: "80px 40px",
                position: "relative",
                zIndex: 10
            }}>
                <div style={{
                    textAlign: "center",
                    marginBottom: "60px"
                }}>
                    <h2 style={{
                        fontSize: "48px",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "16px"
                    }}>
                        Why choose <span className="gradient-text">JoinIn</span>?
                    </h2>
                    <p style={{
                        fontSize: "20px",
                        color: "rgba(255, 255, 255, 0.7)",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        Built for the modern world with cutting-edge technology
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "32px",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    <div className="feature-card">
                        <div style={{
                            fontSize: "48px",
                            marginBottom: "20px"
                        }}>⚡</div>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "white",
                            marginBottom: "12px"
                        }}>Lightning Fast</h3>
                        <p style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6"
                        }}>
                            Connect instantly with zero delays. Our optimized servers ensure smooth, lag-free video calls every time.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div style={{
                            fontSize: "48px",
                            marginBottom: "20px"
                        }}>🔐</div>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "white",
                            marginBottom: "12px"
                        }}>Ultra Secure</h3>
                        <p style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6"
                        }}>
                            End-to-end encryption protects your conversations. Your privacy is our top priority, always.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div style={{
                            fontSize: "48px",
                            marginBottom: "20px"
                        }}>🌍</div>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "white",
                            marginBottom: "12px"
                        }}>Global Reach</h3>
                        <p style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            lineHeight: "1.6"
                        }}>
                            Connect with anyone, anywhere in the world. Our global infrastructure ensures reliable connections.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}