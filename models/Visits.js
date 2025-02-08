import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  _id: { type: String, default: 'visitCounter' }, 
  count: { type: Number, default: 0 },
});

const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
export default Visit;