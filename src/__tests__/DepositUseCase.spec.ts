// Arquivo de exemplo - Instale @types/jest antes de usar
// npm install --save-dev jest @types/jest ts-jest

// import { DepositUseCase } from "@/application/usecases";
// import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
// import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
// import { Account } from "@/domain/entities/Account";
// import { DepositDTO, AccountResponseDTO } from "@/application/dtos";

// // Mock dos repositórios
// const createMockAccountRepository = (): jest.Mocked<IAccountRepository> => ({
//   findById: jest.fn(),
//   create: jest.fn(),
//   save: jest.fn(),
//   delete: jest.fn(),
// });

// const createMockTransactionRepository = (): jest.Mocked<ITransactionRepository> => ({
//   save: jest.fn(),
//   findByAccountId: jest.fn(),
//   deleteAll: jest.fn(),
// });

// describe("DepositUseCase", () => {
//   let depositUseCase: DepositUseCase;
//   let mockAccountRepository: jest.Mocked<IAccountRepository>;
//   let mockTransactionRepository: jest.Mocked<ITransactionRepository>;

//   beforeEach(() => {
//     mockAccountRepository = createMockAccountRepository();
//     mockTransactionRepository = createMockTransactionRepository();
//     depositUseCase = new DepositUseCase(
//       mockAccountRepository,
//       mockTransactionRepository
//     );
//   });

//   describe("execute", () => {
//     it("should create a new account and deposit amount when account does not exist", async () => {
//       const destination = "newAccount";
//       const amount = 100;
//       const dto = new DepositDTO(destination, amount);

//       mockAccountRepository.findById.mockResolvedValue(null);
//       mockAccountRepository.create.mockResolvedValue(
//         new Account(destination, 0)
//       );
//       mockAccountRepository.save.mockResolvedValue(
//         new Account(destination, amount)
//       );
//       mockTransactionRepository.save.mockResolvedValue({
//         id: "1",
//         type: "deposit",
//         accountId: destination,
//         amount,
//         timestamp: new Date(),
//       } as any);

//       const result = await depositUseCase.execute(dto);

//       expect(mockAccountRepository.findById).toHaveBeenCalledWith(destination);
//       expect(mockAccountRepository.create).toHaveBeenCalledWith(destination, 0);
//       expect(mockAccountRepository.save).toHaveBeenCalled();
//       expect(mockTransactionRepository.save).toHaveBeenCalled();
//       expect(result).toEqual(
//         new AccountResponseDTO(destination, amount)
//       );
//     });

//     it("should deposit to existing account", async () => {
//       const destination = "existingAccount";
//       const amount = 50;
//       const dto = new DepositDTO(destination, amount);

//       const existingAccount = new Account(destination, 100);
//       mockAccountRepository.findById.mockResolvedValue(existingAccount);
//       mockAccountRepository.save.mockResolvedValue(
//         new Account(destination, 150)
//       );
//       mockTransactionRepository.save.mockResolvedValue({
//         id: "2",
//         type: "deposit",
//         accountId: destination,
//         amount,
//         timestamp: new Date(),
//       } as any);

//       const result = await depositUseCase.execute(dto);

//       expect(mockAccountRepository.save).toHaveBeenCalled();
//       expect(result).toEqual(
//         new AccountResponseDTO(destination, 150)
//       );
//     });
//   });
// });
