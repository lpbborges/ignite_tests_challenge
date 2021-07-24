import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show user profile", () => {
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user profile", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "johndoe@test.com",
      password: "123456"
    });

    const userProfile = await showUserProfileUseCase.execute(id as string);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("name");
  });

  it("should not be able to show an inexistent user profile", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existent-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});
