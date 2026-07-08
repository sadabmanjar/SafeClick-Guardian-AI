import Complaint, { IComplaint } from '../models/complaint.model';
import { AppError } from '../middlewares/error.middleware';
import { createSystemNotification } from './notification.service';

export const submitComplaint = async (data: Partial<IComplaint>): Promise<IComplaint> => {
  const newComplaint = new Complaint(data);
  await newComplaint.save();

  if (newComplaint.userId) {
    await createSystemNotification({
      userId: newComplaint.userId,
      title: 'Complaint Generated Successfully',
      message: `Your complaint (${newComplaint.complaintId}) has been successfully submitted and is under review.`,
      type: 'complaint',
      priority: 'high',
      redirectUrl: `/dashboard/complaints/${newComplaint._id}`,
    });
  }

  return newComplaint;
};

export const getComplaintsHistory = async (userId: string): Promise<IComplaint[]> => {
  return Complaint.find({ userId }).sort({ createdAt: -1 });
};

export const getComplaintById = async (id: string, userId?: string): Promise<IComplaint> => {
  const query: any = { _id: id };
  if (userId) query.userId = userId;

  const complaint = await Complaint.findOne(query);
  if (!complaint) {
    const err: AppError = new Error('Complaint not found');
    err.statusCode = 404;
    throw err;
  }
  return complaint;
};
