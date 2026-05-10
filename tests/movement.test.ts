import { processPendingMovements } from '../src/services/movement.service';
import Movement from '../src/models/Movement';
import Stock from '../src/models/Stock';

// Mockeamos mongoose y los modelos para la prueba aislada
jest.mock('mongoose', () => ({
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  }),
  Types: { ObjectId: jest.fn() }
}));

jest.mock('../src/models/Movement');
jest.mock('../src/models/Stock');

describe('Movement Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Procesa un movimiento de salida exitoso con stock suficiente', async () => {
    const mockMovement = {
      _id: 'mov1',
      type: 'salida',
      productId: 'prod1',
      sourceBranch: 'branch1',
      quantity: 5,
      status: 'pending',
      retryCount: 0,
      save: jest.fn()
    };

    (Movement.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([mockMovement])
      })
    });

    (Stock.findOne as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue({
        quantity: 10 // Stock suficiente (10 > 5)
      })
    });

    (Stock.findOneAndUpdate as jest.Mock).mockResolvedValue(true);

    const result = await processPendingMovements();

    expect(result.processed).toBe(1);
    expect(result.failed).toBe(0);
    expect(mockMovement.status).toBe('processed');
    expect(mockMovement.save).toHaveBeenCalled();
  });

  it('Falla al procesar una salida por stock insuficiente', async () => {
    const mockMovement = {
      _id: 'mov2',
      type: 'salida',
      productId: 'prod1',
      sourceBranch: 'branch1',
      quantity: 15,
      status: 'pending',
      retryCount: 0,
      save: jest.fn()
    };

    (Movement.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([mockMovement])
      })
    });

    (Stock.findOne as jest.Mock).mockReturnValue({
      session: jest.fn().mockResolvedValue({
        quantity: 10 // Stock INSUFICIENTE (10 < 15)
      })
    });

    const result = await processPendingMovements();

    expect(result.processed).toBe(0);
    expect(result.failed).toBe(1);
    expect(mockMovement.status).toBe('failed');
    expect(mockMovement.errorMessage).toBe('Stock insuficiente en la sucursal de origen');
    expect(mockMovement.save).toHaveBeenCalled();
  });
});
