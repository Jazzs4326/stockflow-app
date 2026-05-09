import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStock extends Document {
  productId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const StockSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El ID del producto es requerido'],
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'El ID de la sucursal es requerido'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto único para asegurar que solo exista un registro de stock por producto y sucursal
StockSchema.index({ productId: 1, branchId: 1 }, { unique: true });

const Stock: Model<IStock> = mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
