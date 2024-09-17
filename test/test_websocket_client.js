import WebSocket from 'ws';

// Function to test the /shell endpoint
function testShellEndpoint() {
  const ws = new WebSocket('ws://localhost:3002/shell');

  ws.on('open', () => {
    console.log('Connected to /shell WebSocket');
    const testCommand = { command: 'echo "Hello from shell!"' };
    ws.send(JSON.stringify(testCommand));
  });

  ws.on('message', (data) => {
    const response = JSON.parse(data);
    console.log('Received response from /shell:');
    console.log('stdout:', response.stdout);
    console.log('stderr:', response.stderr);
    ws.close();
  });

  ws.on('close', () => {
    console.log('Disconnected from /shell WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error in /shell:', error.message);
  });
}

// Function to test the /ssh endpoint
function testSSHEndpoint() {
  const ws = new WebSocket('ws://localhost:3002/ssh');

  ws.on('open', () => {
    console.log('Connected to /ssh WebSocket');
    // Simulate SSH handshake (this is just a placeholder, not a real SSH handshake)
    const sshHandshake = Buffer.from('SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5\r\n');
    ws.send(sshHandshake);
  });

  ws.on('message', (data) => {
    console.log('Received data from /ssh:', data.toString('hex').slice(0, 100) + '...');
    // In a real scenario, we would continue the SSH protocol here
    ws.close();
  });

  ws.on('close', () => {
    console.log('Disconnected from /ssh WebSocket');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error in /ssh:', error.message);
  });
}

// Run tests
testShellEndpoint();
setTimeout(testSSHEndpoint, 2000); // Wait 2 seconds before testing SSH to avoid confusion in logs
