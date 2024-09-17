import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000/shell');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a test command
  const testCommand = { command: 'echo "Hello, WebSocket!"' };
  ws.send(JSON.stringify(testCommand));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log('Received response:');
  console.log('stdout:', response.stdout);
  console.log('stderr:', response.stderr);
  ws.close();
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});
