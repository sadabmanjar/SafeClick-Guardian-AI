import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  complaintId: string;
  userId?: string;
  category: string;
  subCategory?: string;
  incidentDate: Date;
  platform: string;
  lossAmount?: number;
  transactionId?: string;
  bankName?: string;
  victimDetails: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  suspectDetails?: {
    phone?: string;
    upiId?: string;
    bankAccount?: string;
    websiteUrl?: string;
    otherDetails?: string;
  };
  narrative: string;
  evidenceFiles: Array<{
    fileName: string;
    fileType: string;
    fileSize: string;
    hashKey?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema({
  complaintId: { type: String, unique: true, index: true },
  userId: { type: String, required: false, index: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  incidentDate: { type: Date, required: true },
  platform: { type: String, required: true },
  lossAmount: { type: Number },
  transactionId: { type: String },
  bankName: { type: String },
  victimDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },
  suspectDetails: {
    phone: { type: String },
    upiId: { type: String },
    bankAccount: { type: String },
    websiteUrl: { type: String },
    otherDetails: { type: String },
  },
  narrative: { type: String, required: true },
  evidenceFiles: [
    {
      fileName: { type: String, required: true },
      fileType: { type: String, required: true },
      fileSize: { type: String, required: true },
      hashKey: { type: String },
    },
  ],
}, {
  timestamps: true,
});

// Auto-generate complaint ID before validation
ComplaintSchema.pre('validate', function (next) {
  if (!this.complaintId) {
    // format: CMP-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.complaintId = `CMP-${year}-${random}`;
  }
  next();
});

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
