import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

describe("Create statement use case", () => {
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to show the statement operation", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    });

    const { id: statement_id } = await inMemoryStatementsRepository.create({
      user_id: user_id as string,
      amount: 1000,
      description: "Deposit",
      type: OperationType.DEPOSIT
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user_id as string,
      statement_id: statement_id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to show the statement for an inexistent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "non-existent-user",
        statement_id: "statement_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to show the statement for an inexistent user", async () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "123456",
      });

      await getStatementOperationUseCase.execute({
        user_id: user_id as string,
        statement_id: "non-existent-statement"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
