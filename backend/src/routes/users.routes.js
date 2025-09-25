import express from 'express';
import { login, register, addToActivity, getUserActivity } from '../controllers/user.controller.js';

const router = express.Router();

// Existing routes
router.post('/login', login);
router.post('/register', register);

// ADD THESE NEW ROUTES
router.post('/add_to_activity', addToActivity);
router.get('/get_all_activity', getUserActivity);

export default router;