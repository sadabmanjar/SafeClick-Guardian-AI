import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { analyzeContentWithGemini } from '../services/gemini.service';
import Scan from '../models/scan.model';

export const createScan = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, contentType } = req.body;
    const userId = req.user?.userId;

    const analysisResult = await analyzeContentWithGemini(content, contentType);

    const newScan = new Scan({
      userId,
      content,
      contentType,
      ...analysisResult,
    });

    await newScan.save();

    res.status(201).json({
      status: 'success',
      data: newScan,
    });
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
    const scans = await Scan.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: scans.length,
      data: scans,
    });
  } catch (error) {
    next(error);
  }
};
