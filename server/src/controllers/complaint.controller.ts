import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { submitComplaint, getComplaintsHistory, getComplaintById as getComplaint } from '../services/complaint.service';
import { sendSuccess } from '../utils/response.util';

export const createComplaint = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const complaintData = {
      userId,
      ...req.body,
    };

    const newComplaint = await submitComplaint(complaintData);
    sendSuccess(res, 201, 'Complaint submitted successfully', newComplaint);
  } catch (error) {
    next(error);
  }
};

export const getComplaints = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    const complaints = await getComplaintsHistory(userId);
    sendSuccess(res, 200, 'Complaints retrieved successfully', complaints);
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const complaint = await getComplaint(id, userId);
    sendSuccess(res, 200, 'Complaint retrieved successfully', complaint);
  } catch (error) {
    next(error);
  }
};
