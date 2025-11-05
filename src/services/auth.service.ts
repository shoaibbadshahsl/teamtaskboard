import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { createBadRequestError, createNotFoundError, createUnauthorizedError } from '../utils/errors';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const register = async (data: RegisterData) => {
  const { email, password, name } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createBadRequestError('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    password: hashedPassword,
    name,
  });

  await user.save();

  return { message: 'User registered successfully' };
};

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw createUnauthorizedError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createUnauthorizedError('Invalid credentials');
  }

  // Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set.'); // Internal server error
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token };
};
