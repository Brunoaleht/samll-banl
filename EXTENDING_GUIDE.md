# Guia Prático: Adicionando Novas Features

## Exemplo Prático: Adicionar Feature de "Histórico de Transações"

Vamos adicionar um endpoint para obter o histórico de transações de uma conta.

### Passo 1: Criar o DTO

**Arquivo**: `src/application/dtos/index.ts`

Adicione:

```typescript
export class GetTransactionHistoryDTO {
  constructor(public accountId: string, public limit?: number) {}
}

export class TransactionResponseDTO {
  constructor(
    public id: string,
    public type: "deposit" | "withdraw" | "transfer",
    public accountId: string,
    public amount: number,
    public timestamp: Date,
    public destinationAccountId?: string
  ) {}
}

export class TransactionHistoryResponseDTO {
  constructor(public transactions: TransactionResponseDTO[]) {}
}
```

### Passo 2: Criar o UseCase

**Arquivo**: `src/application/usecases/GetTransactionHistoryUseCase.ts`

```typescript
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import {
  GetTransactionHistoryDTO,
  TransactionHistoryResponseDTO,
  TransactionResponseDTO,
} from "../dtos";

export class GetTransactionHistoryUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(
    dto: GetTransactionHistoryDTO
  ): Promise<TransactionHistoryResponseDTO> {
    const transactions = await this.transactionRepository.findByAccountId(
      dto.accountId,
      dto.limit
    );

    const dtos = transactions.map(
      (t) =>
        new TransactionResponseDTO(
          t.id,
          t.type,
          t.accountId,
          t.amount,
          t.timestamp,
          t.destinationAccountId
        )
    );

    return new TransactionHistoryResponseDTO(dtos);
  }
}
```

### Passo 3: Atualizar o RepositoryFactory

**Arquivo**: `src/infrastructure/repositories/RepositoryFactory.ts`

Adicione o método `getTransactionRepository()` se não existir:

```typescript
static getTransactionRepository(): ITransactionRepository {
  if (!RepositoryFactory.transactionRepository) {
    const storage = getStorage();
    RepositoryFactory.transactionRepository = new TransactionRepository(storage);
  }
  return RepositoryFactory.transactionRepository;
}
```

### Passo 4: Criar o Controller

**Arquivo**: `src/presentation/controllers/GetTransactionHistoryController.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { GetTransactionHistoryUseCase } from "@/application/usecases";
import { GetTransactionHistoryDTO } from "@/application/dtos";
import { AppError, NotFoundError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class GetTransactionHistoryController {
  private useCase: GetTransactionHistoryUseCase;

  constructor() {
    const transactionRepository = RepositoryFactory.getTransactionRepository();
    this.useCase = new GetTransactionHistoryUseCase(transactionRepository);
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const accountId = searchParams.get("account_id");
      const limit = searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : undefined;

      if (!accountId) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const dto = new GetTransactionHistoryDTO(accountId, limit);
      const result = await this.useCase.execute(dto);

      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Passo 5: Adicionar o Controller às Exportações

**Arquivo**: `src/presentation/controllers/index.ts`

Adicione:

```typescript
export { GetTransactionHistoryController } from "./GetTransactionHistoryController";
```

### Passo 6: Adicionar o UseCase às Exportações

**Arquivo**: `src/application/usecases/index.ts`

Adicione:

```typescript
export { GetTransactionHistoryUseCase } from "./GetTransactionHistoryUseCase";
```

### Passo 7: Criar a Rota API

**Arquivo**: `src/app/api/transactions/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/auth/middleware";
import { GetTransactionHistoryController } from "@/presentation/controllers";

const controller = new GetTransactionHistoryController();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return await controller.handle(request);
}
```

### Passo 8: Testar a Nova Feature

```bash
# 1. Fazer login primeiro
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","pass":"admin"}'

# Copie o token da resposta

# 2. Fazer alguns depósitos/saques
curl -X POST http://localhost:3000/api/event \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"deposit","destination":"alice","amount":100}'

# 3. Buscar histórico
curl -X GET "http://localhost:3000/api/transactions?account_id=alice&limit=10" \
  -H "Authorization: Bearer <seu_token>"

# Resposta esperada
{
  "transactions": [
    {
      "id": "1",
      "type": "deposit",
      "accountId": "alice",
      "amount": 100,
      "timestamp": "2024-11-29T10:30:00.000Z"
    }
  ]
}
```

## Exemplo 2: Adicionar Validação com Zod

### Passo 1: Instalar Zod

```bash
npm install zod
```

### Passo 2: Criar Schema de Validação

**Arquivo**: `src/shared/schemas/index.ts`

```typescript
import { z } from "zod";

export const DepositSchema = z.object({
  destination: z.string().min(1, "destination is required"),
  amount: z.number().positive("amount must be positive"),
});

export const WithdrawSchema = z.object({
  origin: z.string().min(1, "origin is required"),
  amount: z.number().positive("amount must be positive"),
});

export const TransferSchema = z.object({
  origin: z.string().min(1, "origin is required"),
  destination: z.string().min(1, "destination is required"),
  amount: z.number().positive("amount must be positive"),
});

export const LoginSchema = z.object({
  username: z.string().min(1, "username is required"),
  pass: z.string().min(1, "password is required"),
});
```

### Passo 3: Usar no Controller

**Arquivo**: `src/presentation/controllers/DepositController.ts`

Substitua a validação manual por:

```typescript
import { DepositSchema } from "@/shared/schemas";

async handle(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
  try {
    const validated = DepositSchema.parse(body);
    const dto = new DepositDTO(validated.destination, validated.amount);
    const result = await this.useCase.execute(dto);
    return NextResponse.json(
      { destination: { id: result.id, balance: result.balance } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return this.handleError(error);
  }
}
```

## Exemplo 3: Adicionar Middleware de Rate Limiting

**Arquivo**: `src/lib/middleware/rateLimiter.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

const requests = new Map<string, number[]>();
const MAX_REQUESTS = 100;
const WINDOW_MS = 60000; // 1 minuto

export function rateLimiter(request: NextRequest): boolean {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const userRequests = requests.get(ip)!;
  const recentRequests = userRequests.filter((t) => now - t < WINDOW_MS);

  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return true;
}
```

**Usar em rota**:

```typescript
import { rateLimiter } from "@/lib/middleware/rateLimiter";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!rateLimiter(request)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  // ... resto do código
}
```

## Checklist para Adicionar Novo Use Case

- [ ] Criar/atualizar DTOs em `application/dtos/`
- [ ] Criar UseCase em `application/usecases/`
- [ ] Exportar UseCase em `application/usecases/index.ts`
- [ ] Criar Controller em `presentation/controllers/`
- [ ] Exportar Controller em `presentation/controllers/index.ts`
- [ ] Atualizar RepositoryFactory se necessário
- [ ] Criar rota em `app/api/`
- [ ] Testar endpoint
- [ ] Documentar no `ARCHITECTURE.md`

## Estrutura de Pastas para Nova Feature

```
minha-feature/
├── domain/
│   ├── entities/
│   │   └── MeuEntity.ts
│   └── repositories/
│       └── IMeuRepository.ts
├── application/
│   ├── usecases/
│   │   └── MeuUseCase.ts
│   └── dtos/
│       └── index.ts (adicionar DTOs)
├── infrastructure/
│   └── repositories/
│       └── MeuRepository.ts
└── presentation/
    └── controllers/
        └── MeuController.ts
```

## Dicas de Performance

1. **Paginação**: Sempre paginar listagens grandes
2. **Cache**: Usar cache para dados que mudam pouco
3. **Índices**: Criar índices no banco de dados para queries frequentes
4. **Async/Await**: Usar Promise.all para queries paralelas
5. **Validação**: Validar cedo para evitar processamento desnecessário
