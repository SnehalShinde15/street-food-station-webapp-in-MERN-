import Admin from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during admin login:', error); // Log error details
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getAdminProfile = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id).select('-password');
//     res.json(admin);
//   } catch (error) {
//     console.error('Error fetching admin profile:', error); // Log error details
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Remove this line if using named exports
// export default { adminLogin, getAdminProfile };
