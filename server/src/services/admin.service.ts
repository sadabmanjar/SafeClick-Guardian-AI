import User from '../models/user.model';
import Scan from '../models/scan.model';
import Complaint from '../models/complaint.model';
import Alert from '../models/alert.model';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalScans,
    totalComplaints,
    totalAlerts,
    highRiskScans,
    resolvedAlerts,
  ] = await Promise.all([
    User.countDocuments(),
    Scan.countDocuments(),
    Complaint.countDocuments(),
    Alert.countDocuments(),
    Scan.countDocuments({ riskLevel: { $in: ['high', 'critical'] } }),
    Alert.countDocuments({ resolved: true }),
  ]);

  return {
    totalUsers,
    totalScans,
    totalComplaints,
    totalAlerts,
    highRiskScans,
    resolvedAlerts,
  };
};

export const getAnalytics = async () => {
  // Simple aggregation for most common scam type
  const topScams = await Scan.aggregate([
    { $group: { _id: '$scamType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return {
    topScams,
  };
};
