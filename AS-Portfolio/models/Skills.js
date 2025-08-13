import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
}, { timestamps: true });

const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);

export default Skill;