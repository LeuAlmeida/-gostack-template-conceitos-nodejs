const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json({ ok: true })
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  // Techs array validator
  if (!Array.isArray(techs)) {
    return response.status(400).json({
      error: "Techs must be an array"
    })
  }
  
  // URL validator
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

  if (!regexp.test(url)) {
    return response.status(400).json({ error: 'Invalid URL'})
  }

  const project = { id: uuid(), title, url, techs, likes: 0 }

  repositories.unshift(project)

  return response.json(repositories)
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
