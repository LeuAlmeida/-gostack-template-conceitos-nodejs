const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  // Techs array validator
  if (!Array.isArray(techs)) {
    return response.status(400).json({
      error: "Techs must be an array",
    });
  }

  // URL validator
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (!regexp.test(url)) {
    return response.status(400).json({ error: "Invalid URL" });
  }

  const project = { id: uuid(), title, url, techs, likes: 0 };

  repositories.unshift(project);

  return response.json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // Techs array validator
  if (!Array.isArray(techs)) {
    return response.status(400).json({
      error: "Techs must be an array",
    });
  }

  // URL validator
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (!regexp.test(url)) {
    return response.status(400).json({ error: "Invalid URL" });
  }

  // Repository validator
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "RepositoryIndex does not found." });
  }

  const repository = {
    id,
    title: title || repositories[repositoryIndex].title,
    url: url || repositories[repositoryIndex].url,
    techs: techs || repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "RepositoryIndex does not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "RepositoryIndex does not found." });
  }

  const { title, url, techs, likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repositories);
});

module.exports = app;
