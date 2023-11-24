const fs = require('fs');
const http = require('http');

const server = http.createServer((request, response) => {

  const url = new URL(request.url, `http:${request.headers.host}`);

  switch(url.pathname) {
    case '/':
      if (request.method === 'GET') {
        response.writeHead(202, {'Content-Type': 'text/html'});
        fs.createReadStream('../frontend/index.html').pipe(response);
        break;
      } else if(request.method === 'POST') {
        handlePostResponse(request, response);
        break;
      }
      break;

    default:
      response.writeHead(404, {'Content-Type': 'text/html'});
      fs.createReadStream('../404.html').pipe(response);
      break;
  }
});

server.listen(999, () => {
  console.log("Server is listening at " + server.address().port);
});

function handlePostResponse(request, response){
  request.setEncoding('utf8');
  
  let body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });
  
  request.on('end', function () {
    const choices = ['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const playerChoice = body.split('=')[1].toLowerCase();

    let message;

    const tied = `Aww, we tied! I also chose ${randomChoice}.`;
    const victory = `Dang it, you won! I chose ${randomChoice}.`;
    const defeat = `Ha! You lost. I chose ${randomChoice}.`;

    if (!choices.includes(playerChoice)) {
      message = "Invalid choice. Please choose rock, paper, or scissors.";
    } else if (playerChoice === randomChoice) {
      message = tied;
    } else if (
        (playerChoice === 'rock' && randomChoice === 'paper') ||
        (playerChoice === 'paper' && randomChoice === 'scissors') ||
        (playerChoice === 'scissors' && randomChoice === 'rock')
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`You selected ${playerChoice}. ${message}`);
  });
}