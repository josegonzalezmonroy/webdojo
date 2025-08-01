import { faker } from "@faker-js/faker";

describe("POST /api/users/register", () => {
  it("Deve cadastrar um novo usuário", () => {
    const user = {
      name: 'Wolverine',
      email: 'logan@xmen.com',
      password: "pwd123",
    };

    cy.task("deleteUser", user.email);

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body.message).to.eq("User registered successfully.");
      expect(response.body.user.id).to.match(/^[-]?\d+$/);
      expect(response.body.user.name).to.eq(user.name);
      expect(response.body.user.email).to.eq(user.email);
    });
  });

  it("Não deve cadastrar com email duplicado", () => {
    const user = {
      name: 'Cyclops',
      email: 'scott@xmen.com',
      password: "pwd123",
    };

    cy.task("deleteUser", user.email);

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body.error).to.eq("Email is already in use.");
    });
  });

  it("O campo name deve ser obrigatório", () => {
    const user = {
      email: "papito@teste.com.br",
      password: "pwd123",
    };

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(400);

      expect(response.body.error).to.eq("Name is required.");
    });
  });

  it("O campo email deve ser obrigatório", () => {
    const user = {
      name: "Fernando Papito",
      password: "pwd123",
    };

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(400);

      expect(response.body.error).to.eq("Email is required.");
    });
  });

  it("O campo senha deve ser obrigatório", () => {
    const user = {
      name: "Fernando Papito",
      email: "papito@teste.com.br",
    };

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(400);

      expect(response.body.error).to.eq("Password is required.");
    });
  });

  it("Não deve passar quando o JSON está mal formatado", () => {
    const user = `{
      name: "Fernando Papito",
      email: "papito@teste.com.br"
      password: "pwd123"
    }`

    cy.postUser(user).then((response) => {
      expect(response.status).to.eq(400);

      expect(response.body.error).to.eq("Invalid JSON format.");
    });
  });
});
