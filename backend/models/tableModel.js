import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    tableNumber: { type: String, required: true },
});

// Default export
const Table = mongoose.model('Table', tableSchema);
export default Table;