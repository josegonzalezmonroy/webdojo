describe("GET /api/users", () => {
  const heroes = [
    {
      name: "Clark Kent",
      email: "clark.kent@dailyplanet.com",
      password: "pwd123",
    },
    {
      name: "Bruce Wayne",
      email: "bruce.wayne@wayneenterprises",
      password: "pwd123",
    },
    { name: "Diana Prince", email: "diana.prince@themys", password: "pwd123" },
    {
      name: "Peter Parker",
      email: "peter.parker@dailybugle",
      password: "pwd123",
    },
    {
      name: "Tony Stark",
      email: "tony.stark@starkindustr",
      password: "pwd123",
    },
  ];

  before(() => {
    heroes.forEach((hero) => {
      cy.postUser(hero);
    });
  });

  it("Deve retornar uma lista de usuários", () => {
    cy.getUsers().then((response) => {
      expect(response.status).to.eq(200);

      heroes.forEach((hero) => {
        const found = response.body.find((user) => user.email === hero.email);
        expect(found.name).to.eq(hero.name);
        expect(found.email).to.eq(hero.email);
        expect(found).to.have.property("id");
      });
    });
  });
});
