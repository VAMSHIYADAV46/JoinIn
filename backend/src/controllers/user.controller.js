import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt"
import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide username and password" })
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToActivity = async (req, res) => {
    const { token, meeting_code } = req.body;

    if (!token) {
        return res.status(400).json({ 
            success: false,
            message: "Authentication token is required" 
        });
    }

    if (!meeting_code) {
        return res.status(400).json({ 
            success: false,
            message: "Meeting code is required" 
        });
    }

    try {
        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                success: false,
                message: "Invalid or expired token" 
            });
        }

        // Check if meeting already exists
        let meeting = await Meeting.findOne({ meetingId: meeting_code });
        
        if (meeting) {
            // Add user to existing meeting if not already there
            if (!meeting.participants.some(p => p.toString() === user._id.toString())) {
                meeting.participants.push(user._id);
                await meeting.save();
            }
        } else {
            // Create new meeting with user as host
            meeting = new Meeting({
                meetingId: meeting_code,
                hostId: user._id,
                participants: [user._id],
                createdAt: new Date(),
                // Legacy fields for backward compatibility
                meeting_code: meeting_code,
                user_id: user._id.toString(),
                date: new Date()
            });
            await meeting.save();
        }

        res.status(httpStatus.OK).json({
            success: true,
            message: "Successfully joined meeting",
            meeting: {
                meetingId: meeting.meetingId,
                isHost: meeting.hostId.toString() === user._id.toString(),
                participantCount: meeting.participants.length
            }
        });

    } catch (error) {
        console.error("Add to activity error:", error);
        res.status(500).json({
            success: false,
            message: `Failed to join meeting: ${error.message}`
        });
    }
}

const getUserActivity = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Authentication token is required"
        });
    }

    try {
        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Get all meetings where user is a participant
        const meetings = await Meeting.find({
            participants: user._id
        }).sort({ createdAt: -1 }); // Most recent first

        res.status(httpStatus.OK).json({
            success: true,
            meetings: meetings.map(meeting => ({
                meetingId: meeting.meetingId,
                createdAt: meeting.createdAt,
                isHost: meeting.hostId.toString() === user._id.toString(),
                participantCount: meeting.participants.length
            }))
        });

    } catch (error) {
        console.error("Get user activity error:", error);
        res.status(500).json({
            success: false,
            message: `Failed to get activity: ${error.message}`
        });
    }
}

export { login, register, addToActivity, getUserActivity }