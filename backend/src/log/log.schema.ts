import { Schema, Document } from 'mongoose';

// Define the Log interface to specify the structure of a log document
export interface Log extends Document {
  type: string;  // 'failed-login' or 'unauthorized-access'
  message: string;
  timestamp: Date;
  email: string;
}

// Define the Log Schema
export const LogSchema = new Schema<Log>({
  type: { type: String},
  message: { type: String},
  email: { type: String},
  timestamp: { type: Date, default: Date.now },
});

// Register the schema to be used in NestJS
export default LogSchema;
