import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    let [isConnecting, setIsConnecting] = useState(false);

    const videoRef = useRef([])
    let [videos, setVideos] = useState([])

    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);
        }
    }, [video, audio])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }
    let handleAudio = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/home"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    
    let closeChat = () => {
        setModal(false);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        if (message.trim() && socketRef.current) {
            socketRef.current.emit('chat-message', message, username)
            setMessage("");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    let connect = () => {
        if (username.trim()) {
            setIsConnecting(true);
            setAskForUsername(false);
            getMedia();
        }
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

                .control-btn {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    backdrop-filter: blur(8px);
                }

                .control-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }

                .video-btn {
                    background: ${video ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'};
                    color: white;
                }

                .audio-btn {
                    background: ${audio ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'};
                    color: white;
                }

                .screen-btn {
                    background: ${screen ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
                    color: ${screen ? 'white' : 'rgba(255, 255, 255, 0.8)'};
                }

                .chat-btn {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    position: relative;
                }

                .end-call-btn {
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                }

                .chat-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #f59e0b;
                    color: white;
                    border-radius: 12px;
                    min-width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                }

                .video-container {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                }

                .local-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 16px;
                }

                .remote-video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 12px;
                }

                .input-field {
                    width: 100%;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 16px;
                    outline: none;
                    backdrop-filter: blur(8px);
                }

                .input-field::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }

                .input-field:focus {
                    border-color: rgba(99, 102, 241, 0.6);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .btn {
                    padding: 12px 24px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                    backdrop-filter: blur(8px);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .message-bubble {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .message-sender {
                    font-weight: 600;
                    color: #a855f7;
                    margin-bottom: 4px;
                    font-size: 14px;
                }

                .message-text {
                    color: black;
                    margin: 0;
                    line-height: 1.4;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>

            {askForUsername ? (
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
                        className="glass-card slide-in"
                        style={{
                            padding: "48px",
                            maxWidth: "500px",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <h1
                            style={{
                                color: "white",
                                fontSize: "32px",
                                fontWeight: "300",
                                marginBottom: "16px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Join Meeting
                        </h1>
                        
                        <p
                            style={{
                                color: "rgba(255, 255, 255, 0.7)",
                                marginBottom: "32px",
                                fontSize: "16px",
                                lineHeight: "1.5",
                            }}
                        >
                            Enter your name to join the video conference
                        </p>

                        <div style={{ marginBottom: "32px" }}>
                            <div
                                className="video-container"
                                style={{
                                    width: "200px",
                                    height: "150px",
                                    margin: "0 auto",
                                    background: "#000",
                                }}
                            >
                                <video 
                                    ref={localVideoref} 
                                    autoPlay 
                                    muted 
                                    className="local-video"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <input
                                className="input-field"
                                placeholder="Enter your name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && connect()}
                                autoFocus
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={connect}
                            disabled={!username.trim() || isConnecting}
                            style={{
                                width: "100%",
                                fontSize: "16px",
                                opacity: (!username.trim() || isConnecting) ? 0.5 : 1,
                                cursor: (!username.trim() || isConnecting) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isConnecting ? '🔄 Connecting...' : '🚀 Join Meeting'}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                    {/* Chat Modal */}
                    {showModal && (
                        <div
                            style={{
                                position: "fixed",
                                top: 0,
                                right: 0,
                                width: "400px",
                                height: "100vh",
                                zIndex: 1000,
                            }}
                        >
                            <div
                                className="glass-card slide-in"
                                style={{
                                    height: "100%",
                                    margin: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "24px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "24px",
                                    }}
                                >
                                    <h2
                                        style={{
                                            color: "white",
                                            margin: 0,
                                            fontSize: "20px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        💬 Chat
                                    </h2>
                                    <button
                                        onClick={closeChat}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "rgba(255, 255, 255, 0.7)",
                                            fontSize: "24px",
                                            cursor: "pointer",
                                            padding: "4px",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        overflowY: "auto",
                                        marginBottom: "20px",
                                        padding: "0 8px",
                                    }}
                                >
                                    {messages.length === 0 ? (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                color: "rgba(255, 255, 255, 0.6)",
                                                fontStyle: "italic",
                                                marginTop: "40px",
                                            }}
                                        >
                                            No messages yet. Start the conversation!
                                        </div>
                                    ) : (
                                        messages.map((item, index) => (
                                            <div key={index} className="message-bubble">
                                                <div className="message-sender">{item.sender}</div>
                                                <p className="message-text">{item.data}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: "12px" }}>
                                    <input
                                        className="input-field"
                                        placeholder="Type your message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        style={{ flex: 1, padding: "12px 16px" }}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={sendMessage}
                                        disabled={!message.trim()}
                                        style={{
                                            padding: "12px 16px",
                                            opacity: !message.trim() ? 0.5 : 1,
                                            cursor: !message.trim() ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        📤
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Video Area */}
                    
                    <div style={{ flex: 1, padding: "20px", display: "flex", gap: "20px" }}>
                    {/* Local Video */}
                    <div
                        style={{
                        flex: videos.length > 0 ? 1 : "unset",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        }}
                    >
                        <div
                        className="video-container"
                        style={{
                            width: videos.length > 0 ? "100%" : "auto",
                            height: videos.length > 0 ? "100%" : "auto",
                            maxWidth: videos.length > 0 ? "100%" : "800px",
                            maxHeight: videos.length > 0 ? "100%" : "450px",
                            minHeight: "200px",
                            background: "#000",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: "0 auto", // centers the box
                        }}
                        >
                        <video
                            ref={localVideoref}
                            autoPlay
                            muted
                            className="local-video"
                            style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                            }}
                        />
                        <div
                            style={{
                            position: "absolute",
                            bottom: "16px",
                            left: "16px",
                            background: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            }}
                        >
                            You ({username})
                        </div>
                        </div>
                    </div>

                    {/* Remote Videos */}
                    {videos.length > 0 && (
                        <div style={{ flex: 1 }}>
                        <div
                            style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "16px",
                            height: "100%",
                            }}
                        >
                            {videos.map((video, index) => (
                            <div
                                key={video.socketId}
                                className="video-container"
                                style={{
                                background: "#000",
                                position: "relative",
                                minHeight: "200px",
                                }}
                            >
                                <video
                                data-socket={video.socketId}
                                ref={ref => {
                                    if (ref && video.stream) {
                                    ref.srcObject = video.stream;
                                    }
                                }}
                                autoPlay
                                className="remote-video"
                                />
                                <div
                                style={{
                                    position: "absolute",
                                    bottom: "16px",
                                    left: "16px",
                                    background: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                                >
                                Participant {index + 1}
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>


                    {/* Control Panel */}
                    <div
                        className="glass-card"
                        style={{
                            margin: "20px auto",
                            padding: "20px",
                            display: "flex",
                            gap: "16px",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <button
                            className="control-btn video-btn"
                            onClick={handleVideo}
                            title={video ? "Turn off camera" : "Turn on camera"}
                        >
                            {video ? "📹" : "📹"}
                        </button>

                        <button
                            className="control-btn audio-btn"
                            onClick={handleAudio}
                            title={audio ? "Mute microphone" : "Unmute microphone"}
                        >
                            {audio ? "🎤" : "🔇"}
                        </button>

                        {screenAvailable && (
                            <button
                                className="control-btn screen-btn"
                                onClick={handleScreen}
                                title={screen ? "Stop screen sharing" : "Share screen"}
                            >
                                {screen ? "🛑" : "📺"}
                            </button>
                        )}

                        <button
                            className="control-btn chat-btn"
                            onClick={() => setModal(!showModal)}
                            title="Toggle chat"
                        >
                            💬
                            {newMessages > 0 && (
                                <div className="chat-badge">
                                    {newMessages > 99 ? '99+' : newMessages}
                                </div>
                            )}
                        </button>

                        <button
                            className="control-btn end-call-btn"
                            onClick={handleEndCall}
                            title="End call"
                        >
                            📞
                        </button>
                    </div>

                    {/* Meeting Info */}
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                        }}
                    >
                        <div
                            className="glass-card"
                            style={{
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#10b981",
                                }}
                            />
                            <span
                                style={{
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                Meeting: {window.location.pathname.substring(1)}
                            </span>
                        </div>
                    </div>

                    {/* Participants Count */}
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                        }}
                    >
                        <div
                            className="glass-card"
                            style={{
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span style={{ fontSize: "16px" }}>👥</span>
                            <span
                                style={{
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                {videos.length + 1} participant{videos.length !== 0 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}