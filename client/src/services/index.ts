/**
 * Services barrel index.
 * Import all services from here instead of individual files.
 *
 * Example: import { scanService, complaintService } from '@/services';
 */

export { authService } from './auth.service';
export { scanService, extractApiError } from './scan.service';
export { complaintService } from './complaint.service';
export { emergencyService } from './emergency.service';
export { adminService } from './admin.service';
export { analyzerService } from './analyzer.service';
