import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('ok');
});

server.listen(5173, '127.0.0.1', () => {
  console.log('listening on 127.0.0.1:5173');
});
