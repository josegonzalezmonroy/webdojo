const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON format." });
  }
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API do curso Ninja do Cypress!" });
});

app.post("/api/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required." });
  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!password)
    return res.status(400).json({ error: "Password is required." });

  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email is already in use." });
    }

    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching users." });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name) return res.status(400).json({ error: "Name is required." });
  if (!email) return res.status(400).json({ error: "Email is required." });
  if (!password)
    return res.status(400).json({ error: "Password is required." });

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, password },
    });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
