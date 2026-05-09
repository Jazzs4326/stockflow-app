import mongoose, { Schema, Document, Model } from 'mongoose';

export type MovementType = 'entrada' | 'salida' | 'transferencia';
export type MovementStatus = 'pending' | 'processed' | 'failed';

export interface IMovement extends Document {
  productId: mongoose.Types.ObjectId;
  sourceBranch?: mongoose.Types.ObjectId;
  destinationBranch?: mongoose.Types.ObjectId;
  quantity: number;
  type: MovementType;
  status: MovementStatus;
  retryCount: number;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MovementSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El ID del producto es requerido'],
      index: true,
    },
    sourceBranch: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      // Requerido si es salida o transferencia
      required: function (this: IMovement) {
        return this.type === 'salida' || this.type === 'transferencia';
      },
    },
    destinationBranch: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      // Requerido si es entrada o transferencia
      required: function (this: IMovement) {
        return this.type === 'entrada' || this.type === 'transferencia';
      },
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'La cantidad debe ser mayor a 0'],
    },
    type: {
      type: String,
      enum: ['entrada', 'salida', 'transferencia'],
      required: [true, 'El tipo de movimiento es requerido'],
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending',
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para facilitar las búsquedas del worker y los reportes
MovementSchema.index({ status: 1, createdAt: 1 }); // Para el worker (buscar pending antiguos)
MovementSchema.index({ createdAt: 1, type: 1 }); // Para reportes por fecha y tipo

const Movement: Model<IMovement> = mongoose.models.Movement || mongoose.model<IMovement>('Movement', MovementSchema);

export default Movement;
