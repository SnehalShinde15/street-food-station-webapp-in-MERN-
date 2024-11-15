// routes/tableRoute.js
import express from 'express';
import { createReservation, getReservations ,deleteReservation} from '../controllers/tableController.js'; // Added .js extension

const router = express.Router();

router.post('/reserve', createReservation);
router.get('/reservations', getReservations);
router.delete('/reservations/:id', deleteReservation);

export default router; // Changed module.exports to export default