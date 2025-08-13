import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    imageUrl: String,
    title: String,
}, { timestamps: true });

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);

export default Certificate;