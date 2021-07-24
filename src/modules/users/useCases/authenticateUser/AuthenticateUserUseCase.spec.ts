import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate user use case", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate user", async () => {
    const password = await hash("123456", 8);

    await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password
    });

    const result = await authenticateUserUseCase.execute({
      email: "johndoe@test.com",
      password: "123456"
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });

  it("should not be able to authenticate an non existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non-existent-user@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "johndoe@test.com",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "johndoe@test.com",
        password: "incorrect-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
