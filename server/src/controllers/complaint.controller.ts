import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Complaint from '../models/complaint.model';
import { generateComplaintWithGemini } from '../services/gemini.service';
import { submitComplaint, getComplaintsHistory, getComplaintById as getComplaint } from '../services/complaint.service';
import { sendSuccess } from '../utils/response.util';

export const createComplaint = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('[DEBUG] createComplaint hit');
  try {
    const userId = req.user?.userId;
    const complaintData = {
      userId,
      ...req.body,
    };

    const newComplaint = await submitComplaint(complaintData);
    sendSuccess(res, 201, 'Complaint submitted successfully', newComplaint);
  } catch (error) {
    console.error('[DEBUG] createComplaint error:', error);
    if (typeof next === 'function') {
      next(error);
    } else {
      console.error('[DEBUG] next is not a function in createComplaint!');
      res.status(500).json({ success: false, message: 'next is not a function', error: (error as Error)?.message });
    }
  }
};

export const generateComplaint = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const formData = req.body;
    const generatedText = await generateComplaintWithGemini(formData);

    res.status(200).json({
      status: 'success',
      data: {
        complaintText: generatedText,
      },
    });
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

    const complaint = await getComplaint(id as string, userId);
    sendSuccess(res, 200, 'Complaint retrieved successfully', complaint);
  } catch (error) {
    next(error);
  }
};
