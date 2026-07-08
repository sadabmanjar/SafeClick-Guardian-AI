import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Complaint from '../models/complaint.model';
import { generateComplaintWithGemini } from '../services/gemini.service';

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

    const newComplaint = new Complaint(complaintData);
    await newComplaint.save();

    res.status(201).json({
      status: 'success',
      data: newComplaint,
    });
  } catch (error) {
    next(error);
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
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};
