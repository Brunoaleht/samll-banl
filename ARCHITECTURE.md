# Arquitetura da Aplicação

## Visão Geral

A aplicação segue os princípios SOLID e arquitetura em camadas (Clean Architecture), permitindo fácil desacoplagem e migração futura para microserviços.

## Estrutura de Diretórios

```
src/
├── domain/                    # Camada de Domínio (Núcleo da lógica)
│   ├── entities/             # Objetos de Domínio (Account, Transaction)
│   └── repositories/         # Interfaces de Repositórios (Contratos)
│
├── application/              # Camada de Aplicação
│   ├── usecases/            # Casos de Uso (Lógica de Negócio)
│   └── dtos/                # Data Transfer Objects
│
├── infrastructure/           # Camada de Infraestrutura
│   └── repositories/        # Implementações dos Repositórios
│
├── presentation/             # Camada de Apresentação
│   └── controllers/         # Controllers (Orquestração de Requisições)
│
├── shared/                   # Código Compartilhado
│   ├── errors/              # Classes de Erro Customizadas
│   └── types/               # Tipos Compartilhados
│
├── lib/                      # Utilitários (Auth, Storage, API Client)
├── contexts/                 # React Contexts (Estado Global)
├── hooks/                    # React Hooks Customizados
└── app/                      # Rotas Next.js
    └── api/                 # API Routes
```

## Princípios SOLID Implementados

### 1. Single Responsibility Principle (SRP)
- Cada classe tem uma única responsabilidade
- Controllers orquestram requisições
- UseCases contêm lógica de negócio
- Repositories gerenciam persistência

### 2. Open/Closed Principle (OCP)
- Entidades e usecases são abertos para extensão
- Novos casos de uso podem ser adicionados sem modificar os existentes
- Interfaces de repositórios permitem múltiplas implementações

### 3. Liskov Substitution Principle (LSP)
- Repositórios implementam interfaces bem definidas
- Podem ser substituídos sem quebrar o código

### 4. Interface Segregation Principle (ISP)
- Interfaces pequenas e específicas
- `IAccountRepository` e `ITransactionRepository` são segregadas

### 5. Dependency Inversion Principle (DIP)
- UsesCases dependem de abstrações (interfaces), não de implementações concretas
- RepositoryFactory injeta as dependências

## Fluxo de Dados

```
Request → API Route → Controller → UseCase → Repository → Storage Adapter → Database
                                      ↓
                                    DTO
                                      ↓
Response
```

## Como Adicionar um Novo Use Case

### 1. Defina a Entidade (se necessário)
Arquivo: `src/domain/entities/NewEntity.ts`

```typescript
export class NewEntity {
  constructor(public id: string, public data: string) {}
}
```

### 2. Crie o Repositório (Interface)
Arquivo: `src/domain/repositories/INewRepository.ts`

```typescript
import { NewEntity } from "../entities/NewEntity";

export interface INewRepository {
  findById(id: string): Promise<NewEntity | null>;
  save(entity: NewEntity): Promise<NewEntity>;
}
```

### 3. Implemente o Repositório
Arquivo: `src/infrastructure/repositories/NewRepository.ts`

```typescript
import { INewRepository } from "@/domain/repositories/INewRepository";

export class NewRepository implements INewRepository {
  async findById(id: string): Promise<NewEntity | null> {
    // Implementação
  }
  
  async save(entity: NewEntity): Promise<NewEntity> {
    // Implementação
  }
}
```

### 4. Crie o DTO (se necessário)
Arquivo: `src/application/dtos/index.ts` (adicionar)

```typescript
export class NewActionDTO {
  constructor(public param: string) {}
}
```

### 5. Crie o UseCase
Arquivo: `src/application/usecases/NewActionUseCase.ts`

```typescript
import { INewRepository } from "@/domain/repositories/INewRepository";
import { NewActionDTO } from "../dtos";

export class NewActionUseCase {
  constructor(private repository: INewRepository) {}

  async execute(dto: NewActionDTO): Promise<ResultType> {
    // Lógica de negócio
  }
}
```

### 6. Crie o Controller
Arquivo: `src/presentation/controllers/NewActionController.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { NewActionUseCase } from "@/application/usecases";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class NewActionController {
  private useCase: NewActionUseCase;

  constructor() {
    const repository = RepositoryFactory.getNewRepository();
    this.useCase = new NewActionUseCase(repository);
  }

  async handle(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
    try {
      const dto = new NewActionDTO(body.param as string);
      const result = await this.useCase.execute(dto);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### 7. Registre no RepositoryFactory
Arquivo: `src/infrastructure/repositories/RepositoryFactory.ts` (adicionar)

```typescript
static getNewRepository(): INewRepository {
  if (!RepositoryFactory.newRepository) {
    RepositoryFactory.newRepository = new NewRepository();
  }
  return RepositoryFactory.newRepository;
}
```

### 8. Exporte o Controller
Arquivo: `src/presentation/controllers/index.ts` (adicionar)

```typescript
export { NewActionController } from "./NewActionController";
```

### 9. Crie a Rota API
Arquivo: `src/app/api/new-action/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { NewActionController } from "@/presentation/controllers";

const controller = new NewActionController();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  return await controller.handle(request, body);
}
```

## Tratamento de Erros

A aplicação utiliza classes de erro customizadas:

- `AppError` - Erro genérico (500)
- `ValidationError` - Erro de validação (400)
- `NotFoundError` - Recurso não encontrado (404)
- `UnauthorizedError` - Não autorizado (401)
- `ForbiddenError` - Acesso proibido (403)
- `InsufficientFundsError` - Fundos insuficientes (400)

## Migração para Microserviços

Para migrar um domínio para um microserviço:

1. Copie a pasta `src/domain` para o novo projeto
2. Implemente novos repositórios baseado em sua infraestrutura
3. Copie os usecases da pasta `src/application`
4. Adapte os controllers para o novo framework
5. Remova as dependências do projeto principal

## Padrões de Código

### UseCase Pattern
```typescript
export class MyUseCase {
  constructor(private repo: IRepository) {}
  
  async execute(dto: MyDTO): Promise<ResultDTO> {
    // Validação
    // Lógica de negócio
    // Persistência
    // Retorno DTO
  }
}
```

### Controller Pattern
```typescript
export class MyController {
  private useCase: MyUseCase;
  
  constructor() {
    this.useCase = new MyUseCase(RepositoryFactory.getRepository());
  }
  
  async handle(request, body): Promise<NextResponse> {
    // Validação
    // Chamada usecase
    // Tratamento erro
  }
}
```

## Testes

Para adicionar testes unitários:

```typescript
describe('NewUseCase', () => {
  let useCase: NewUseCase;
  let mockRepository: jest.Mocked<INewRepository>;

  beforeEach(() => {
    mockRepository = createMock<INewRepository>();
    useCase = new NewUseCase(mockRepository);
  });

  it('should execute successfully', async () => {
    const result = await useCase.execute(new NewDTO(...));
    expect(result).toBeDefined();
  });
});
```
