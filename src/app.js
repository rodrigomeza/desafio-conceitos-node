const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid repository ID.'});
  }

  return next();
};


app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  // const {id, title, url, techs, likes } = request.query;


  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  // const repository = { id: uuid(), title, techs, url: `github.com/${title.toLowerCase().replace(/ /g, "-")}`, likes: 0};
  const repository = { id: uuid(), title, techs, url, likes: 0};

  repositories.push(repository);
  
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs, likes} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0){
    return response.status(400).json({erro: 'Repository no found.'})
  }

  const repository = {
    id,
    title, 
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);


  
});

app.delete("/repositories/:id", (request, response) => {
    const {id} = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id)

    if(repositoryIndex < 0){
      return response.status(400).json({erro: 'Repository no found.'})
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
//TODO

  const {id} = request.params;


  const repository = repositories.find(repository => repository.id === id)

  repository.likes += 1

  return response.json(repository);

});

module.exports = app;

