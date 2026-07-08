import User, { IUser } from '../models/user.model';
import { AppError } from '../middlewares/error.middleware';
import { createSystemNotification } from './notification.service';

export const syncUser = async (
  supabaseUserId: string,
  email: string,
  fullName: string,
  phone?: string,
  avatar?: string
): Promise<IUser> => {
  if (!supabaseUserId || !email) {
    const err: AppError = new Error('Supabase User ID and email are required');
    err.statusCode = 400;
    throw err;
  }

  // Check if user already exists
  let user = await User.findOne({ supabaseUserId });

  if (user) {
    // Optionally update fields if they changed (like avatar or name)
    let isUpdated = false;
    if (fullName && user.fullName !== fullName) {
      user.fullName = fullName;
      isUpdated = true;
    }
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar;
      isUpdated = true;
    }
    if (phone && user.phone !== phone) {
      user.phone = phone;
      isUpdated = true;
    }

    if (isUpdated) {
      await user.save();
    }

    // Trigger Login Success Notification
    await createSystemNotification({
      userId: supabaseUserId,
      title: 'Login Successful',
      message: 'Welcome back to SafeClick Guardian AI.',
      type: 'info',
      priority: 'low',
    });
  } else {
    // Create new user
    user = new User({
      supabaseUserId,
      email,
      fullName,
      phone,
      avatar,
      role: 'citizen',
    });
    await user.save();

    // Trigger Welcome Notification
    await createSystemNotification({
      userId: supabaseUserId,
      title: 'Welcome to SafeClick Guardian AI',
      message: 'Your account has been successfully created. Stay safe!',
      type: 'success',
      priority: 'medium',
    });
  }

  return user;
};

export const getUserProfile = async (supabaseUserId: string): Promise<IUser> => {
  const user = await User.findOne({ supabaseUserId });
  if (!user) {
    const err: AppError = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};
