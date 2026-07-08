import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { processScan, getScanHistory, getScanById as getScan, deleteScanById } from '../services/scan.service';
import { sendSuccess } from '../utils/response.util';

export const createScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, contentType, location } = req.body;
    const userId = req.user?.userId;
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

    const { newScan, timings } = await processScan({
      userId,
      content,
      contentType,
      location,
      ipAddress,
    });

    console.log(`[PIPELINE AUDIT] - Gemini AI: ${timings.geminiTime}ms | MongoDB Save: ${timings.mongoTime}ms`);

    sendSuccess(res, 201, 'Scan processed successfully', newScan);
  } catch (error) {
    next(error);
  }
};

export const getScans = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error('User ID required');

    const scans = await getScanHistory(userId);
    sendSuccess(res, 200, 'Scans retrieved successfully', scans);
  } catch (error) {
    next(error);
  }
};

export const getScanById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const scan = await getScan(id as string, userId);
    sendSuccess(res, 200, 'Scan retrieved successfully', scan);
  } catch (error) {
    next(error);
  }
};

export const deleteScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    await deleteScanById(id as string, userId);
    sendSuccess(res, 200, 'Threat scan entry successfully deleted', null);
  } catch (error) {
    next(error);
  }
};
