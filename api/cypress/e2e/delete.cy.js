describe("DELETE /api/users/:id", () => {
  context("Remoção", () => {
    let userId;

    const user = {
      name: "Hulk",
      email: "hulk@teste.com",
      password: "pwd123",
    };

    before(() => {
      cy.task("deleteUser", user.email);

      cy.postUser(user).then((response) => {
        userId = response.body.user.id;
      });
    });

    it("Deve deletar um usuário existente", () => {
      cy.deleteUser(userId).then((response) => {
        expect(response.status).to.eq(204);
      });
    });

    after(() => {
      cy.getUsers().then((response) => {
        const userCheck = response.body.find((u) => u.id === userId);
        expect(userCheck).to.be.undefined;
      });
    });
  });

  context("Quando o id não existe", () => {
    let userId;

    const user = {
      name: "Tony Stark",
      email: "stark@teste.com",
      password: "pwd123",
    };

    before(() => {
      cy.task("deleteUser", user.email);

      cy.postUser(user).then((response) => {
        userId = response.body.user.id;
      });

      cy.task("deleteUser", user.email);
    });

    it("Deve retornar 404 e user not found", () => {
      cy.deleteUser(userId).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body.error).to.eq("User not found.");
      });
    });
  });
});
