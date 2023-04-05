const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = 'docs';

const requestHandler = (request, response) => {
  const urlPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.join(__dirname, PUBLIC_DIR, urlPath);

  if (!fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end(`File not found: ${urlPath}`);
    console.warn(`404: ${urlPath}`);
    return;
  }

  const extname = path.extname(filePath);
  const contentType = getContentType(extname);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content, 'utf-8');
    console.error(`200: ${urlPath}`);
  } catch (error) {
    const code = error.code || 500;
    const message = error.message || 'Internal Server Error';
    response.writeHead(code);
    response.end(`${code}: ${message}`);
    console.error(`${code}: ${urlPath}`);
  }
};

const getContentType = (extname) => {
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
};

// Run server
const server = http.createServer(requestHandler);

server.listen(PORT, (error) => {
  if (error) {
    console.log(`Failed to start server: ${error}`);
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
});
