import mongoose, { Schema, Document } from 'mongoose';

export interface IDistrict extends Document {
  districtId: string;
  districtName: string;
  geoJsonId: string; // Matches 'dtname' in geojson
  totalCases: number;
  financialLoss: number;
  riskScore: number;
  commonScam: string;
  recentIncidents: number;
  nearbyStation: string;
  lastUpdated: Date;
}

const DistrictSchema: Schema = new Schema({
  districtId: { type: String, required: true, unique: true },
  districtName: { type: String, required: true },
  geoJsonId: { type: String, required: true },
  totalCases: { type: Number, default: 0 },
  financialLoss: { type: Number, default: 0 },
  riskScore: { type: Number, default: 0 },
  commonScam: { type: String, default: 'None' },
  recentIncidents: { type: Number, default: 0 },
  nearbyStation: { type: String, default: 'State Cyber Cell HQ' },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model<IDistrict>('District', DistrictSchema);
