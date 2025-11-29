export class GetBalanceDTO {
  constructor(public accountId: string) {}
}

export class DepositDTO {
  constructor(public destination: string, public amount: number) {}
}

export class WithdrawDTO {
  constructor(public origin: string, public amount: number) {}
}

export class TransferDTO {
  constructor(
    public origin: string,
    public destination: string,
    public amount: number
  ) {}
}

export class LoginDTO {
  constructor(public username: string, public password: string) {}
}

export class BalanceResponseDTO {
  constructor(public balance: number) {}
}

export class AccountResponseDTO {
  constructor(public id: string, public balance: number) {}
}

export class LoginResponseDTO {
  constructor(public token: string) {}
}

export class EventResponseDTO {
  constructor(
    public origin?: AccountResponseDTO,
    public destination?: AccountResponseDTO
  ) {}
}
