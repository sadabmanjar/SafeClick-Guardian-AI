import { Router } from 'express';
import { 
  getDistricts, 
  getIncidents, 
  getStats, 
  getCharts, 
  reportIncident, 
  triggerIngestion 
} from '../controllers/heatmap.controller';

const router = Router();

router.get('/districts', getDistricts);
router.get('/incidents', getIncidents);
router.get('/stats', getStats);
router.get('/charts', getCharts);
router.post('/report', reportIncident);
router.post('/ingest', triggerIngestion);

export default router;
