import mongoose, { Schema, Document } from "mongoose";

interface Doctor extends Document {
  name: string;
  specialty: string;
  experience: number;
  location: string;
  clinic?: string;
  fee: number;
  onlineFee?: number;
  visitFee?: number;
  qualifications?: string;
}

const DoctorSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    specialty: { type: String, required: [true, "Specialty is required"] },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: 0,
    },
    location: { type: String, required: [true, "Location is required"] },
    clinic: { type: String },
    fee: { type: Number, required: [true, "Fee is required"], min: 0 },
    onlineFee: { type: Number, min: 0 },
    visitFee: { type: Number, min: 0 },
    qualifications: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor ||
  mongoose.model<Doctor>("Doctor", DoctorSchema);
