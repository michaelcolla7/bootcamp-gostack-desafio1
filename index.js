const express = require('express'); 

const server = express();
server.use(express.json());

//lista inicial de projetos 
const projects = [ 
  { 
    id : "1", 
    title: "Implantação CRM", 
    tasks : [] 
  },
  { 
    id : "2", 
    title: "Inbound Marketing", 
    tasks : [] 
  },
  { 
    id : "3", 
    title:"Marketing Digital", 
    tasks : [] 
  }
];

// Middleware para contar o total de requisicoes
var totalReq = 0;
server.use((req, res, next) => {
  totalReq++;
  console.log(`All requests: ${totalReq}`);
  console.time('Request');
  console.log(`Method: ${req.method} - URL: ${req.url}`);

  next();

  console.timeEnd('Request');
  console.log('----', '\n');
});

// Middleware para validar se id do projeto existe
function validarID(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'This id project does not exists' });
  }

  return next();
}

//listar todos os projetos
server.get('/projects', (req, res) => {
  return res.json( projects );
});

//listar um unico projeto
server.get('/projects/:id', validarID, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  return res.json( project );
});

//cadastrar um projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  
  return res.json(project);
});

//editar um projeto (somente o titulo) pelo id
server.put('/projects/:id', validarID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//excluir um projeto
server.delete('/projects/:id', validarID, (req, res) => {
  const { id } = req.params;

  const projectId = projects.findIndex(p => p.id == id);

  projects.splice(projectId, 1);

  return res.send();
});

//adicionar uma tarefa ao projeto, pelo id
server.post('/projects/:id/tasks', validarID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3333);