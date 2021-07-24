import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("Create statement use case", () => {
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getBalanceUserUseCase: GetBalanceUseCase;

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUserUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to show the balance for a user", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456",
    })

    const result = await getBalanceUserUseCase.execute({
      user_id: user_id as string,
    });

    expect(result).toHaveProperty("statement");
    expect(result).toHaveProperty("balance");
  });

  it("should not be able to show the balance for an inexistent user", async () => {
    expect(async () => {
      await getBalanceUserUseCase.execute({
        user_id: "non-existent-user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
