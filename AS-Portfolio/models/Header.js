import mongoose from 'mongoose';

const headerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: String,
    githubLink: String,
    linkedInLink: String,
    isSelected: { type: Boolean, default: false },
}, { timestamps: true });

const Header = mongoose.models.Header || mongoose.model('Header', headerSchema);

export default Header;