import * as React from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Authentication() {
    // Initialize all state variables with empty strings to prevent controlled/uncontrolled warning
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername('');
                setName('');
                setPassword('');
                setMessage(result);
                setOpen(true);
                setError('');
                setFormState(0);
            }
        } catch (err) {
            console.log(err);
            let message = err.response?.data?.message || "An error occurred";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const switchForm = (newState) => {
        setFormState(newState);
        setError("");
        setMessage("");
        setUsername("");
        setPassword("");
        setName("");
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setOpen(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [open]);

    return (
        <div
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <style jsx="true">{`
                .auth-btn {
                    background: linear-gradient(
                        135deg,
                        #6366f1 0%,
                        #8b5cf6 100%
                    );
                    position: relative;
                    overflow: hidden;
                }
                .auth-btn::before {
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
                .auth-btn:hover::before {
                    left: 100%;
                }
                .tab-btn {
                    transition: all 0.3s ease;
                }
                .tab-btn.active {
                    background: linear-gradient(
                        135deg,
                        #6366f1 0%,
                        #8b5cf6 100%
                    );
                    color: white;
                }
                .feature-item {
                    opacity: 0;
                    animation: fadeInUp 0.6s forwards;
                }
                .feature-item:nth-child(1) {
                    animation-delay: 0.1s;
                }
                .feature-item:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .feature-item:nth-child(3) {
                    animation-delay: 0.3s;
                }
                .feature-item:nth-child(4) {
                    animation-delay: 0.4s;
                }

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

                .input-field {
                    display: block;
                    width: 100%;
                    border-radius: 8px;
                    border: 1px solid #d1d5db;
                    background-color: #f9fafb;
                    padding: 12px 12px 12px 40px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s;
                }

                .input-field:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 1px #6366f1;
                }

                .icon-left {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: #9ca3af;
                }

                .eye-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: #9ca3af;
                    cursor: pointer;
                }
            `}</style>

            <div style={{ 
                zIndex: 10, 
                width: "100%", 
                maxWidth: "1200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto"
            }}>
                <div
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        overflow: "hidden",
                        borderRadius: "40px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            minHeight: "735px",
                            gridTemplateColumns: "repeat(2, 1fr)",
                        }}
                    >
                        {/* Left Side - Brand Panel */}
                        <div
                            style={{
                                position: "relative",
                                margin: "16px",
                                borderRadius: "24px",
                                background:
                                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)",
                                padding: "48px",
                                color: "white",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        marginBottom: "48px",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    JoinIn 
                                </div>
                                <h1
                                    style={{
                                        marginBottom: "16px",
                                        fontSize: "48px",
                                        fontWeight: "500",
                                        lineHeight: "1.1",
                                    }}
                                >
                                    Connect, Meet, and Collaborate
                                </h1>
                                <p
                                    style={{
                                        marginBottom: "48px",
                                        fontSize: "20px",
                                        opacity: "0.8",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    Join thousands of users who trust JoinIn for
                                    seamless video meetings and collaboration
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "24px",
                                    }}
                                >
                                    {[
                                        {
                                            icon: "🎨",
                                            title: "HD Video Quality",
                                            desc: "Crystal clear video calls every time",
                                        },
                                        {
                                            icon: "👥",
                                            title: "Team Collaboration",
                                            desc: "Work together seamlessly in real-time",
                                        },
                                        {
                                            icon: "🔒",
                                            title: "Secure Meetings",
                                            desc: "End-to-end encryption for your privacy",
                                        },
                                    ].map(({ icon, title, desc }, i) => (
                                        <div
                                            key={i}
                                            className="feature-item"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    marginRight: "16px",
                                                    display: "flex",
                                                    height: "32px",
                                                    width: "32px",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "8px",
                                                    backgroundColor:
                                                        "rgba(255, 255, 255, 0.2)",
                                                    backdropFilter: "blur(8px)",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {icon}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        marginBottom: "2px",
                                                    }}
                                                >
                                                    {title}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "14px",
                                                        opacity: "0.7",
                                                    }}
                                                >
                                                    {desc}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form Panel */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                padding: "48px",
                            }}
                        >
                            <div
                                style={{
                                    margin: "0 auto",
                                    width: "100%",
                                    maxWidth: "400px",
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom: "32px",
                                        textAlign: "center",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: "32px",
                                            fontWeight: "300",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            marginBottom: "8px",
                                            color: "#1f2937",
                                        }}
                                    >
                                        {formState === 0
                                            ? "Welcome back"
                                            : "Join us today"}
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                        }}
                                    >
                                        {formState === 0
                                            ? "Sign in to continue your journey"
                                            : "Create your account to start meeting"}
                                    </p>
                                </div>

                                {/* Tab Buttons */}
                                <div
                                    style={{
                                        marginBottom: "24px",
                                        display: "flex",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        padding: "4px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => switchForm(0)}
                                        className={`tab-btn ${formState === 0 ? "active" : ""}`}
                                        style={{
                                            flex: 1,
                                            borderRadius: "6px",
                                            padding: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            border: "none",
                                            cursor: "pointer",
                                            backgroundColor:
                                                formState === 0
                                                    ? ""
                                                    : "transparent",
                                            color:
                                                formState === 0
                                                    ? "white"
                                                    : "#6b7280",
                                        }}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => switchForm(1)}
                                        className={`tab-btn ${formState === 1 ? "active" : ""}`}
                                        style={{
                                            flex: 1,
                                            borderRadius: "6px",
                                            padding: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            border: "none",
                                            cursor: "pointer",
                                            backgroundColor:
                                                formState === 1
                                                    ? ""
                                                    : "transparent",
                                            color:
                                                formState === 1
                                                    ? "white"
                                                    : "#6b7280",
                                        }}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "24px",
                                        width: "100%",
                                        textAlign: "left",
                                    }}
                                >
                                    {/* Name field - only show for signup */}
                                    {formState === 1 && (
                                        <div>
                                            <label
                                                style={{
                                                    display: "block",
                                                    marginBottom: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.025em",
                                                    color: "#374151",
                                                }}
                                            >
                                                Full Name
                                            </label>
                                            <div
                                                style={{ position: "relative" }}
                                            >
                                                <div className="icon-left">
                                                    👤
                                                </div>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) =>
                                                        setName(e.target.value)
                                                    }
                                                    className="input-field"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.025em",
                                                color: "#374151",
                                            }}
                                        >
                                            Username
                                        </label>
                                        <div style={{ position: "relative" }}>
                                            <div className="icon-left">✉️</div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                className="input-field"
                                                placeholder="Enter your username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "8px",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.025em",
                                                color: "#374151",
                                            }}
                                        >
                                            Password
                                        </label>
                                        <div style={{ position: "relative" }}>
                                            <div className="icon-left">🔒</div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="input-field"
                                                placeholder="Enter your password"
                                                style={{ paddingRight: "48px" }}
                                            />
                                            <button
                                                type="button"
                                                className="eye-icon"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                }}
                                            >
                                                {showPassword ? "🙈" : "👁️"}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div
                                            style={{
                                                color: "#ef4444",
                                                fontSize: "14px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleAuth}
                                        className="auth-btn"
                                        disabled={loading}
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            padding: "12px 16px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "white",
                                            border: "none",
                                            cursor: loading
                                                ? "not-allowed"
                                                : "pointer",
                                            opacity: loading ? 0.5 : 1,
                                            transition: "all 0.3s",
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                >
                                                    ⏳
                                                </span>
                                                <span>
                                                    {formState === 0
                                                        ? "Signing in..."
                                                        : "Creating account..."}
                                                </span>
                                            </>
                                        ) : formState === 0 ? (
                                            "Sign in to your account"
                                        ) : (
                                            "Create your account"
                                        )}
                                    </button>
                                </div>

                                <div
                                    style={{
                                        marginTop: "32px",
                                        textAlign: "center",
                                        fontSize: "14px",
                                        color: "#6b7280",
                                    }}
                                >
                                    {formState === 0 ? (
                                        <>
                                            Don't have an account?{" "}
                                            <button
                                                onClick={() => switchForm(1)}
                                                style={{
                                                    color: "#6366f1",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Sign up for free
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => switchForm(0)}
                                                style={{
                                                    color: "#6366f1",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Sign in here
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Message Snackbar */}
            {open && message && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                        zIndex: 1000,
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}