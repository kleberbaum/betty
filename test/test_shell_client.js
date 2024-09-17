import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3000/shell');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a test command
  const testCommand = 'ls -ali';
  ws.send(testCommand);
});

ws.on('message', (data) => {
  console.log('Received response:');
  try {
    const response = JSON.parse(data.toString());
    console.log('Command output:', response.output);
  } catch (error) {
    console.error('Error parsing response:', error);
    console.log('Raw response:', data.toString());
  }
  ws.close();
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});
