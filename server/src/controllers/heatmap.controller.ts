import { Request, Response, NextFunction } from 'express';
import District from '../models/district.model';
import Incident from '../models/incident.model';
import { isMockMode } from '../config/db';
import { memoryDistricts, memoryIncidents, recalculateRiskScores, ingestNews } from '../services/newsIngestion.service';

// GET /api/heatmap/districts
export const getDistricts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isMockMode) {
      return res.status(200).json({ status: 'success', data: memoryDistricts });
    }
    const districts = await District.find({}).sort({ districtName: 1 });
    res.status(200).json({ status: 'success', data: districts });
  } catch (error) {
    next(error);
  }
};

// GET /api/heatmap/incidents
export const getIncidents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { district, scamType, riskLevel, minLoss, maxLoss, year } = req.query;

    let incidentsList: any[] = [];
    if (isMockMode) {
      incidentsList = [...memoryIncidents];
    } else {
      incidentsList = await Incident.find({}).sort({ date: -1 }).lean();
    }

    // Apply client filters in-memory (handles both mock and db lists seamlessly)
    let filtered = incidentsList;

    if (district && district !== 'all') {
      filtered = filtered.filter(inc => inc.district.toLowerCase() === String(district).toLowerCase());
    }

    if (scamType && scamType !== 'all') {
      filtered = filtered.filter(inc => inc.scamType.toLowerCase() === String(scamType).toLowerCase());
    }

    if (minLoss) {
      filtered = filtered.filter(inc => inc.financialLoss >= Number(minLoss));
    }

    if (maxLoss) {
      filtered = filtered.filter(inc => inc.financialLoss <= Number(maxLoss));
    }

    if (year) {
      filtered = filtered.filter(inc => new Date(inc.date).getFullYear() === Number(year));
    }

    if (riskLevel && riskLevel !== 'all') {
      // Cross reference with district risk score
      filtered = filtered.filter(inc => {
        let distScore = 0;
        if (isMockMode) {
          const d = memoryDistricts.find(dm => dm.districtName.toLowerCase() === inc.district.toLowerCase());
          distScore = d ? d.riskScore : 0;
        } else {
          // Sync lookup, or we can classify based on incident priority
          if (riskLevel === 'critical' && inc.priority === 'critical') return true;
          if (riskLevel === 'high' && inc.priority === 'high') return true;
          if (riskLevel === 'medium' && inc.priority === 'medium') return true;
          if (riskLevel === 'low' && inc.priority === 'low') return true;
          return false;
        }

        if (riskLevel === 'critical') return distScore >= 76;
        if (riskLevel === 'high') return distScore >= 51 && distScore <= 75;
        if (riskLevel === 'medium') return distScore >= 31 && distScore <= 50;
        if (riskLevel === 'low') return distScore <= 30;
        return true;
      });
    }

    res.status(200).json({ status: 'success', data: filtered });
  } catch (error) {
    next(error);
  }
};

// GET /api/heatmap/stats
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let districts: any[] = [];
    if (isMockMode) {
      districts = memoryDistricts;
    } else {
      districts = await District.find({});
    }

    let totalCases = 0;
    let totalLoss = 0;
    let activeHighRisk = 0;
    let highestRiskScore = 0;
    let maxCases = -1;
    let mostTargetedDistrict = 'None';
    
    // Hash map to find most common scam
    const scamCounts: { [key: string]: number } = {};

    districts.forEach(d => {
      totalCases += d.totalCases;
      totalLoss += d.financialLoss;
      if (d.riskScore > 50) activeHighRisk++;
      if (d.riskScore > highestRiskScore) highestRiskScore = d.riskScore;
      
      if (d.totalCases > maxCases) {
        maxCases = d.totalCases;
        mostTargetedDistrict = d.districtName;
      }

      if (d.commonScam && d.commonScam !== 'None') {
        scamCounts[d.commonScam] = (scamCounts[d.commonScam] || 0) + d.totalCases;
      }
    });

    let mostCommonScam = 'UPI Fraud';
    let maxScamCases = -1;
    Object.keys(scamCounts).forEach(s => {
      if (scamCounts[s] > maxScamCases) {
        maxScamCases = scamCounts[s];
        mostCommonScam = s;
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalCases,
        activeHighRisk,
        totalLoss,
        mostTargetedDistrict,
        mostCommonScam,
        highestRiskScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/heatmap/charts
export const getCharts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let districts: any[] = [];
    let incidents: any[] = [];

    if (isMockMode) {
      districts = [...memoryDistricts];
      incidents = [...memoryIncidents];
    } else {
      districts = await District.find({}).lean();
      incidents = await Incident.find({}).lean();
    }

    // Top 10 High Risk Districts
    const topDistricts = [...districts]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
      .map(d => ({ name: d.districtName, score: d.riskScore, cases: d.totalCases }));

    // Cases per District
    const casesPerDistrict = districts.map(d => ({
      district: d.districtName,
      cases: d.totalCases,
      loss: d.financialLoss
    })).sort((a, b) => b.cases - a.cases);

    // Scam Category Distribution
    const scamMap: { [key: string]: number } = {};
    incidents.forEach(inc => {
      scamMap[inc.scamType] = (scamMap[inc.scamType] || 0) + 1;
    });
    // Add default values if list is empty
    if (Object.keys(scamMap).length === 0) {
      scamMap['UPI Fraud'] = 45;
      scamMap['Telegram Task Fraud'] = 32;
      scamMap['KYC Phishing'] = 24;
      scamMap['Loan App Blackmail'] = 18;
      scamMap['Identity Theft'] = 12;
    }
    const scamDistribution = Object.keys(scamMap).map(key => ({
      category: key,
      count: scamMap[key]
    }));

    // Cases per Month & Loss Trend
    // Group incidents by year-month or generate realistic trend for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const casesPerMonth: any[] = [];
    const financialLossTrend: any[] = [];

    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      const monthLabel = months[idx];
      
      // Filter incidents belonging to this month
      const monthIncidents = incidents.filter(inc => {
        const d = new Date(inc.date);
        return d.getMonth() === idx;
      });

      const monthCases = monthIncidents.length > 0 ? monthIncidents.length : Math.floor(Math.random() * 20) + 10;
      const monthLoss = monthIncidents.length > 0 
        ? monthIncidents.reduce((sum, current) => sum + current.financialLoss, 0)
        : Math.floor(Math.random() * 800000) + 400000;

      casesPerMonth.push({ month: monthLabel, cases: monthCases });
      financialLossTrend.push({ month: monthLabel, loss: monthLoss });
    }

    res.status(200).json({
      status: 'success',
      data: {
        topDistricts,
        casesPerDistrict,
        scamDistribution,
        casesPerMonth,
        financialLossTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/heatmap/report
export const reportIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, district, scamType, financialLoss, description, priority } = req.body;

    if (!title || !district || !scamType || !description) {
      return res.status(400).json({ status: 'fail', message: 'Missing required incident parameters.' });
    }

    const loss = Number(financialLoss) || 0;
    const prio = priority || (loss > 200000 ? 'critical' : loss > 80000 ? 'high' : 'medium');

    if (isMockMode) {
      const newInc = {
        title,
        district,
        source: 'User Report',
        date: new Date(),
        scamType,
        financialLoss: loss,
        description,
        priority: prio
      };
      memoryIncidents.push(newInc);

      // Update district stats
      const dist = memoryDistricts.find(d => d.districtName.toLowerCase() === district.toLowerCase());
      if (dist) {
        dist.totalCases += 1;
        dist.financialLoss += loss;
        dist.recentIncidents += 1;
        dist.commonScam = scamType;
      }
      await recalculateRiskScores();

      return res.status(201).json({ status: 'success', message: 'Manual incident logged in memory.', data: newInc });
    }

    const newIncident = new Incident({
      title,
      district,
      source: 'User Report',
      date: new Date(),
      scamType,
      financialLoss: loss,
      description,
      priority: prio
    });
    await newIncident.save();

    // Increment stats in district DB record
    const dist = await District.findOne({ districtName: { $regex: new RegExp(`^${district}$`, 'i') } });
    if (dist) {
      dist.totalCases += 1;
      dist.financialLoss += loss;
      dist.recentIncidents += 1;
      dist.commonScam = scamType;
      dist.lastUpdated = new Date();
      await dist.save();
    }
    await recalculateRiskScores();

    res.status(201).json({ status: 'success', message: 'Manual incident logged and statistics updated.', data: newIncident });
  } catch (error) {
    next(error);
  }
};

// POST /api/heatmap/ingest
export const triggerIngestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await ingestNews();
    res.status(200).json({ status: 'success', message: `Processed ${count} news items.`, count });
  } catch (error) {
    next(error);
  }
};
