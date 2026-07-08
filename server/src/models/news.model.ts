import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  url: string;
  publishedAt: Date;
  district: string;
  scamType: string;
  processed: boolean;
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  publishedAt: { type: Date, default: Date.now },
  district: { type: String, required: true },
  scamType: { type: String, required: true },
  processed: { type: Boolean, default: false },
});

export default mongoose.model<INews>('News', NewsSchema);
