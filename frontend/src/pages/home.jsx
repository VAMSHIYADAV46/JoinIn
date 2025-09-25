import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Alert } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
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
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>JoinIn</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={() => navigate("/history")}>
                        <RestoreIcon />
                    </IconButton>
                    <p>History</p>

                    <Button onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Life</h2>

                        <div style={{ display: 'flex', gap: "10px", flexDirection: "column" }}>
                            {/* Error Alert */}
                            {error && (
                                <Alert severity="error" onClose={() => setError("")}>
                                    {error}
                                </Alert>
                            )}
                            
                            {/* Success Alert */}
                            {success && (
                                <Alert severity="success" onClose={() => setSuccess("")}>
                                    {success}
                                </Alert>
                            )}

                            <div style={{ display: 'flex', gap: "10px" }}>
                                <TextField 
                                    onChange={e => {
                                        setMeetingCode(e.target.value);
                                        setError(""); // Clear error when user types
                                        setSuccess(""); // Clear success when user types
                                    }}
                                    onKeyPress={handleKeyPress}
                                    value={meetingCode}
                                    id="outlined-basic" 
                                    label="Meeting Code" 
                                    variant="outlined"
                                    error={!!error}
                                    disabled={isLoading}
                                    placeholder="Enter or generate a meeting code"
                                />
                                <Button 
                                    onClick={handleJoinVideoCall} 
                                    variant='contained'
                                    disabled={isLoading || !meetingCode.trim()}
                                >
                                    {isLoading ? 'Joining...' : 'Join'}
                                </Button>
                            </div>
                            
                            {/* Generate Meeting Code Button */}
                            <Button 
                                onClick={generateMeetingCode}
                                variant="outlined"
                                style={{ alignSelf: 'flex-start' }}
                                disabled={isLoading}
                            >
                                Generate Meeting Code
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="" />
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent)