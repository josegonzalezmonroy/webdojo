describe("PUT /api/users/:id", () => {
  context("Atualização", () => {
    let userId;

    const originalUser = {
      name: "Original User",
      email: "original@teste.com",
      password: "originalPassword",
    };

    const updatedUser = {
      name: "Updated User",
      email: "update@teste.com",
      password: "updatedPassword",
    };

    before(() => {
      cy.task("deleteUser", originalUser.email);
      cy.task("deleteUser", updatedUser.email);

      cy.postUser(originalUser).then((response) => {
        userId = response.body.user.id;
      });
    });

    it("Deve atualizar um usuário existente", () => {
      cy.putUser(userId, updatedUser).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

    after(() => {
      cy.getUsers().then((response) => {
        const userCheck = response.body.find((user) => user.id === userId);
        expect(userCheck).to.exist;
        expect(userCheck.name).to.eq(updatedUser.name);
        expect(userCheck.email).to.eq(updatedUser.email);
      });
    });
  });

  context("Quando o id não existe", () => {
    let userId;

    const originalUser = {
      name: "Tony Stark2",
      email: "stark2@teste.com",
      password: "pwd123",
    };

    const updatedUser = {
      name: "Updated Tony Stark2",
      email: "starkup2@teste.com",
      password: "pwd123",
    };

    before(() => {
      cy.task("deleteUser", originalUser.email);
      cy.task("deleteUser", updatedUser.email);

      cy.postUser(originalUser).then((response) => {
        userId = response.body.user.id;
      });

      cy.task("deleteUser", originalUser.email);
    });

    it("Deve retornar 404 e user not found", () => {
      cy.api({
        method: "PUT",
        url: `http://localhost:3333/api/users/${userId}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedUser,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.error).to.eq("User not found.");
      });
    });
  });

  context("Campos obrigatórios", () => {
    it("O campo name deve ser obrigatório", () => {
      const user = {
        email: "papito@teste.com.br",
        password: "pwd123",
      };

      cy.putUser(1, user).then((response) => {
        expect(response.status).to.eq(400);

        expect(response.body.error).to.eq("Name is required.");
      });
    });

    it("O campo email deve ser obrigatório", () => {
      const user = {
        name: "Fernando Papito",
        password: "pwd123",
      };

      cy.putUser(1, user).then((response) => {
        expect(response.status).to.eq(400);

        expect(response.body.error).to.eq("Email is required.");
      });
    });

    it("O campo senha deve ser obrigatório", () => {
      const user = {
        name: "Fernando Papito",
        email: "papito@teste.com.br",
      };

      cy.putUser(1, user).then((response) => {
        expect(response.status).to.eq(400);

        expect(response.body.error).to.eq("Password is required.");
      });
    });

    it("Não deve passar quando o JSON está mal formatado", () => {
      const user = `{
      name: "Fernando Papito",
      email: "papito@teste.com.br"
      password: "pwd123"
    }`;

      cy.putUser(1, user).then((response) => {
        expect(response.status).to.eq(400);

        expect(response.body.error).to.eq("Invalid JSON format.");
      });
    });
  });
});
