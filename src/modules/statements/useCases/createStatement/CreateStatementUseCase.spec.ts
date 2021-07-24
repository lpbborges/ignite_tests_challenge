import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create statement use case", () => {
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createStatementUserUseCase: CreateStatementUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUserUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to create a new statement", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    })


    const statement = await createStatementUserUseCase.execute({
      user_id: user_id as string,
      amount: 500,
      description: "Deposit",
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a new statement", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    })


    const statement = await createStatementUserUseCase.execute({
      user_id: user_id as string,
      amount: 500,
      description: "Deposit",
      type: OperationType.DEPOSIT
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement to an inexistent user", async () => {
    expect(async () => {
      await createStatementUserUseCase.execute({
        user_id: "non-existent-user",
        amount: 500,
        description: "Withdraw",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to make a withdraw statement with insufficient funds", async () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "123456",
      })


      await createStatementUserUseCase.execute({
        user_id: user_id as string,
        amount: 750,
        description: "Withdraw",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
