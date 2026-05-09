import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la sucursal es requerido'],
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'La ubicación es requerida'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Branch: Model<IBranch> = mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
