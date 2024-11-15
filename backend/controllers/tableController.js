// controllers/tableController.js
import Table from '../models/tableModel.js';
import { body, validationResult } from 'express-validator';

export const createReservation = [
    // Input validation
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('phone').notEmpty().withMessage('Phone number is required.'),
    body('date').notEmpty().withMessage('Date is required.'),
    body('time').notEmpty().withMessage('Time is required.'),
    body('numberOfPeople').isInt({ gt: 0 }).withMessage('Number of people must be greater than 0.'),
    body('tableNumber').notEmpty().withMessage('Table number is required.'),
    
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, phone, date, time, numberOfPeople, tableNumber } = req.body;

            // Check if the table is already booked
            const existingReservation = await Table.findOne({ date, time, tableNumber });
            if (existingReservation) {
                return res.status(400).json({ message: 'Table is not available for the selected time.' });
            }

            const newReservation = new Table({ name, email, phone, date, time, numberOfPeople, tableNumber });
            await newReservation.save();

            res.status(201).json({ message: 'Reservation created successfully!', reservation: newReservation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];

export const getReservations = async (req, res) => {
    try {
        const reservations = await Table.find();
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params; // Ensure you're getting the ID from the params
        
        const reservation = await Table.findByIdAndDelete(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

