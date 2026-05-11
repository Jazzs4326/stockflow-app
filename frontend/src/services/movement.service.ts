import mongoose from 'mongoose';
import Movement from '@/models/Movement';
import Stock from '@/models/Stock';

export const processPendingMovements = async () => {
  // Buscamos hasta 50 movimientos pendientes ordenados por antigüedad
  const pendingMovements = await Movement.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .limit(50);

  const results = {
    processed: 0,
    failed: 0,
    errors: [] as string[],
  };

  if (pendingMovements.length === 0) {
    return { ...results, message: 'No hay movimientos pendientes' };
  }

  for (const movement of pendingMovements) {
    // Iniciamos una sesión para garantizar operaciones atómicas (concurrencia)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const quantity = movement.quantity;
      const productId = movement.productId;

      if (movement.type === 'entrada') {
        const destBranch = movement.destinationBranch;
        // Operación atómica de MongoDB (upsert si no existe el stock)
        await Stock.findOneAndUpdate(
          { productId, branchId: destBranch },
          { $inc: { quantity: quantity } },
          { upsert: true, new: true, session }
        );
      } 
      else if (movement.type === 'salida') {
        const sourceBranch = movement.sourceBranch;
        
        // Verificamos stock existente primero
        const stock = await Stock.findOne({ productId, branchId: sourceBranch }).session(session);
        
        if (!stock || stock.quantity < quantity) {
          throw new Error('Stock insuficiente en la sucursal de origen');
        }

        await Stock.findOneAndUpdate(
          { productId, branchId: sourceBranch },
          { $inc: { quantity: -quantity } },
          { session }
        );
      } 
      else if (movement.type === 'transferencia') {
        const sourceBranch = movement.sourceBranch;
        const destBranch = movement.destinationBranch;

        const sourceStock = await Stock.findOne({ productId, branchId: sourceBranch }).session(session);
        
        if (!sourceStock || sourceStock.quantity < quantity) {
          throw new Error('Stock insuficiente en la sucursal de origen para transferencia');
        }

        // Restar de origen atómicamente
        await Stock.findOneAndUpdate(
          { productId, branchId: sourceBranch },
          { $inc: { quantity: -quantity } },
          { session }
        );

        // Sumar a destino atómicamente
        await Stock.findOneAndUpdate(
          { productId, branchId: destBranch },
          { $inc: { quantity: quantity } },
          { upsert: true, new: true, session }
        );
      }

      // Marcar movimiento como procesado
      movement.status = 'processed';
      movement.processedAt = new Date();
      await movement.save({ session });

      await session.commitTransaction();
      results.processed++;
    } catch (error: any) {
      // Revertimos todos los cambios de Stock y Movement en esta transacción
      await session.abortTransaction();
      
      // Actualizamos el movimiento a fallido fuera de la transacción revertida
      movement.status = 'failed';
      movement.errorMessage = error.message || 'Error desconocido';
      movement.retryCount += 1;
      await movement.save();

      results.failed++;
      results.errors.push(`Movimiento ${movement._id}: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  return results;
};
