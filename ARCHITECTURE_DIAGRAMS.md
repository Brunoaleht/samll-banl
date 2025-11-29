# Diagramas da Arquitetura

## 1. Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (Controllers, Routes, Request/Response Handling)        │
│                                                          │
│  - GetBalanceController                                 │
│  - DepositController                                    │
│  - WithdrawController                                   │
│  - TransferController                                   │
│  - ResetController                                      │
│  - LoginController                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ depends on
                       ▼
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LAYER                          │
│  (UseCases, Business Logic, DTOs)                        │
│                                                          │
│  - DepositUseCase                                       │
│  - WithdrawUseCase                                      │
│  - TransferUseCase                                      │
│  - GetBalanceUseCase                                    │
│  - ResetUseCase                                         │
│  - LoginUseCase                                         │
│  - DTOs (Data Transfer Objects)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ depends on
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                          │
│  (Business Entities, Repository Interfaces)             │
│                                                          │
│  Entities:                                              │
│  - Account                                              │
│  - Transaction                                          │
│                                                          │
│  Interfaces:                                            │
│  - IAccountRepository                                   │
│  - ITransactionRepository                               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ implements
                       ▼
┌─────────────────────────────────────────────────────────┐
│             INFRASTRUCTURE LAYER                         │
│  (Repository Implementations, RepositoryFactory)        │
│                                                          │
│  - AccountRepository                                    │
│  - TransactionRepository                                │
│  - RepositoryFactory                                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ uses
                       ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL LAYER (Storage)                    │
│  (IStorageAdapter Interface + Implementations)          │
│                                                          │
│  - MemoryAdapter                                        │
│  - PostgresAdapter                                      │
└─────────────────────────────────────────────────────────┘
```

## 2. Fluxo de Requisição HTTP

```
┌─ POST /api/event ─────────────────────────────────────────┐
│                                                            │
│  Request Body:                                            │
│  {                                                        │
│    "type": "deposit",                                    │
│    "destination": "alice",                               │
│    "amount": 100                                         │
│  }                                                        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
        ┌─ API Route (/app/api/event/route.ts)
        │
        │  1. Parse JSON Body
        │  2. Check event type
        │  3. Route to appropriate controller
        │
        │
        ▼
     ┌──────────────────────────────────┐
     │   DepositController.handle()     │
     │                                  │
     │  1. Validate input               │
     │  2. Create DepositDTO            │
     │  3. Call useCase.execute()       │
     │  4. Handle response/error        │
     └──────────┬───────────────────────┘
                │
                ▼
     ┌──────────────────────────────────┐
     │   DepositUseCase.execute()       │
     │                                  │
     │  1. Check if account exists      │
     │  2. Create account if needed     │
     │  3. Deposit amount               │
     │  4. Save account                 │
     │  5. Record transaction           │
     │  6. Return AccountResponseDTO    │
     └──────────┬───────────────────────┘
                │
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
    ┌──────────────────────┐    ┌──────────────────────────┐
    │  AccountRepository   │    │ TransactionRepository    │
    │  .save(account)      │    │ .save(transaction)       │
    └──────────┬───────────┘    └──────────┬───────────────┘
               │                           │
               ▼                           ▼
    ┌──────────────────────┐    ┌──────────────────────────┐
    │   Storage Adapter    │    │   Storage Adapter        │
    │  (updateBalance)     │    │  (addTransaction)        │
    └──────────┬───────────┘    └──────────┬───────────────┘
               │                           │
               ▼                           ▼
        ┌──────────────────────────────────┐
        │      Database / Memory Store     │
        └──────────────────────────────────┘

                      ◄─ Response ─►

Response:
{
  "destination": {
    "id": "alice",
    "balance": 100
  }
}

HTTP 201 Created
```

## 3. Dependency Injection Flow

```
┌──────────────────────────────┐
│   RepositoryFactory          │
│  (Centraliza Dependências)   │
│                              │
│  - getAccountRepository()    │
│  - getTransactionRepository()│
└──────────┬───────────────────┘
           │
           ├──────────────────┬──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌──────────────┐  ┌────────────┐
    │ Account     │    │ Transaction  │  │ LoginUse   │
    │ Repository  │    │ Repository   │  │ Case       │
    │             │    │              │  │            │
    └──────┬──────┘    └──────┬───────┘  └────────────┘
           │                  │
           │                  │
    ┌──────▼──────┬───────────▼────┐
    │             │                │
    │  Controllers (recebem deps)  │
    │                              │
    │  DepositController           │
    │  WithdrawController          │
    │  TransferController          │
    │  GetBalanceController        │
    │  ResetController             │
    │  LoginController             │
    │                              │
    └──────────────────────────────┘
```

## 4. Estrutura de Pastas Visual

```
src/
│
├── 📁 domain/                  ◄─ Core da Lógica
│   ├── entities/
│   │   ├── Account.ts
│   │   └── Transaction.ts
│   └── repositories/
│       ├── IAccountRepository.ts
│       └── ITransactionRepository.ts
│
├── 📁 application/             ◄─ Casos de Uso
│   ├── usecases/
│   │   ├── DepositUseCase.ts
│   │   ├── WithdrawUseCase.ts
│   │   ├── TransferUseCase.ts
│   │   ├── GetBalanceUseCase.ts
│   │   ├── ResetUseCase.ts
│   │   ├── LoginUseCase.ts
│   │   └── index.ts
│   └── dtos/
│       └── index.ts
│
├── 📁 infrastructure/          ◄─ Implementações
│   └── repositories/
│       ├── AccountRepository.ts
│       ├── TransactionRepository.ts
│       ├── RepositoryFactory.ts
│       └── index.ts (se necessário)
│
├── 📁 presentation/            ◄─ Orquestração HTTP
│   └── controllers/
│       ├── GetBalanceController.ts
│       ├── DepositController.ts
│       ├── WithdrawController.ts
│       ├── TransferController.ts
│       ├── ResetController.ts
│       ├── LoginController.ts
│       └── index.ts
│
├── 📁 shared/                  ◄─ Compartilhado
│   ├── errors/
│   │   └── AppError.ts
│   └── types/
│
├── 📁 lib/                     ◄─ Utilitários
│   ├── api/
│   │   └── client.ts
│   ├── auth/
│   │   ├── jwt.ts
│   │   └── middleware.ts
│   └── storage/
│       ├── adapter.interface.ts
│       ├── memory.adapter.ts
│       ├── postgres.adapter.ts
│       ├── storage.factory.ts
│       └── types.ts
│
├── 📁 contexts/                ◄─ React State
│   ├── account.context.tsx
│   └── auth.context.tsx
│
├── 📁 hooks/                   ◄─ React Custom Hooks
│   ├── use-account.hook.ts
│   └── use-auth.hook.ts
│
├── 📁 components/              ◄─ React Components
│   ├── balance-display/
│   ├── button/
│   ├── input/
│   ├── transaction-form/
│   └── transaction-history/
│
├── 📁 pages/                   ◄─ Page Components
│   ├── dashboard/
│   └── login/
│
├── 📁 app/                     ◄─ Next.js App Router
│   ├── api/
│   │   ├── login/route.ts
│   │   ├── balance/route.ts
│   │   ├── event/route.ts
│   │   └── reset/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── dashboard/page.tsx
│   └── login/page.tsx
│
├── 📁 __tests__/               ◄─ Testes
│   └── DepositUseCase.spec.ts
│
└── middleware.ts
```

## 5. Ciclo de Vida de um UseCase

```
InputValidation
    │
    ▼
CreateDTO
    │
    ▼
ExecuteUseCase
    │
    ├─ ValidateBusiness Rules
    │  │
    │  └─ If invalid → Throw AppError
    │
    ├─ Retrieve Data
    │  │
    │  ├─ repository.findById()
    │  │
    │  └─ If not found → Throw NotFoundError
    │
    ├─ Manipulate Entity
    │  │
    │  ├─ account.deposit(amount)
    │  │
    │  └─ If invalid → Entity throws
    │
    ├─ Persist Data
    │  │
    │  ├─ repository.save(entity)
    │  │
    │  └─ If error → Throw AppError
    │
    ├─ Record Event
    │  │
    │  ├─ transactionRepository.save(tx)
    │  │
    │  └─ If error → Throw AppError
    │
    └─ Return ResponseDTO
       │
       ▼
    Success
```

## 6. Mapping entre Camadas

```
HTTP Request
    │
    ├─ body: any
    │
    ▼
Controller Layer
    │
    ├─ Parse and Validate
    ├─ body: Record<string, unknown>
    │
    ▼
Application Layer
    │
    ├─ DTO (Data Transfer Object)
    │  ├─ DepositDTO
    │  ├─ WithdrawDTO
    │  └─ ...
    │
    ├─ UseCase.execute(dto)
    │
    ▼
Domain Layer
    │
    ├─ Entity (Account, Transaction)
    │  └─ Pure business logic
    │
    ├─ Repository Interface
    │  └─ Abstract persistence
    │
    ▼
Infrastructure Layer
    │
    ├─ Repository Implementation
    │  └─ Adapts to storage
    │
    ▼
External Storage
    │
    └─ Data persisted
```

## 7. Tratamento de Erros

```
UseCase.execute()
    │
    ├─ If input invalid
    │  │
    │  └─ throw ValidationError (400)
    │
    ├─ If resource not found
    │  │
    │  └─ throw NotFoundError (404)
    │
    ├─ If unauthorized
    │  │
    │  └─ throw UnauthorizedError (401)
    │
    ├─ If insufficient funds
    │  │
    │  └─ throw InsufficientFundsError (400)
    │
    ├─ If database error
    │  │
    │  └─ throw AppError (500)
    │
    └─ catch in Controller.handleError()
       │
       ├─ Extract error type
       ├─ Format error message
       │
       ▼
    NextResponse.json(
      { error: message },
      { status: statusCode }
    )
```

## 8. Fluxo de Autenticação

```
Request com Token
    │
    ├─ Extract from header
    │  └─ Authorization: Bearer <token>
    │
    ▼
Middleware (authenticateRequest)
    │
    ├─ Parse token
    ├─ verifyToken(token)
    │  │
    │  └─ jwt.verify()
    │
    ├─ If valid
    │  │
    │  └─ success: true
    │
    └─ If invalid
       │
       └─ Throw UnauthorizedError (401)
```
