import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'model', 'system', 'admin'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['answered', 'pending', 'replied'],
    default: 'answered',
  },
  userEmail: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isQuestion: {
    type: Boolean,
    default: false,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
  },
}, { timestamps: true });

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
