import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
    meetingId: { 
        type: String, 
        required: true,
        unique: true  // This creates an index automatically
    },
    hostId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    // Keep legacy fields for backward compatibility if needed
    user_id: { type: String },
    meeting_code: { type: String },
    date: { type: Date, default: Date.now }
});

// Add indexes for better performance (removed duplicate meetingId index)
// meetingSchema.index({ meetingId: 1 }); // REMOVED - already created by unique: true
meetingSchema.index({ hostId: 1 });
meetingSchema.index({ participants: 1 });
meetingSchema.index({ createdAt: -1 });

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };