import { createBunWebSocket, serveStatic } from "hono/bun";
import { WSContext } from "hono/ws";
import type { TCPSocket } from "bun";
import {app} from '@getcronit/pylon'

export const graphql = {
  Query: {
    sum: (a: number, b: number) => {
      console.log(`Calculating sum of ${a} and ${b}`)
      return a + b
    }
  },
  Mutation: {
    divide: (a: number, b: number) => {
      if (b === 0) {
        console.error('Attempt to divide by zero')
        throw new Error('Division by zero is not allowed')
      }
      console.log(`Dividing ${a} by ${b}`)
      return a / b
    }
  }
}

// Serve static files from the './public' directory
app.use('/*', serveStatic({ root: './client' }))

const { upgradeWebSocket, websocket } = createBunWebSocket();

const sendErrorMessage = (ws: WSContext, errorMessage: string) => {
  const message = { error: errorMessage };
  const messageString = JSON.stringify(message);
  ws.send(messageString);
  console.error(errorMessage);
};

const isValidShellCommand = (command: string): boolean => {
  // List of allowed commands (you can expand this list as needed)
  const allowedCommands = ["ls", "pwd", "echo", "date"];
  const commandName = command.split(" ")[0];
  return allowedCommands.includes(commandName);
};

const executeShellCommand = async (command: string): Promise<string> => {
  try {
    console.log(`Executing command: ${command}`);
    const proc = Bun.spawn(command.split(' '));
    const output = await new Response(proc.stdout).text();
    const error = await new Response(proc.stderr).text();
    console.log(`Command output: ${output}`);
    console.log(`Command error: ${error}`);
    return output || error;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error executing command: ${error.message}`);
      return `Error: ${error.message}`;
    }
    console.error(`Unknown error executing command`);
    return "An unknown error occurred";
  }
};

const handleShellCommand = async (event: MessageEvent, ws: WSContext) => {
  console.info("Shell command received...");
  const command = event.data.toString();
  console.log(`Received command: ${command}`);

  if (!isValidShellCommand(command)) {
    console.warn(`Invalid or unauthorized command: ${command}`);
    sendErrorMessage(ws, "Invalid or unauthorized command");
    return;
  }

  const output = await executeShellCommand(command);
  console.log(`Sending response: ${output}`);
  ws.send(JSON.stringify({ output }));
};

app.get(
  "/shell",
  upgradeWebSocket((c) => {
    return {
      onMessage: (event, ws) => {
        handleShellCommand(event, ws);
      },
      onOpen: () => {
        console.log("Shell connection opened");
      },
      onClose: () => {
        console.log("Shell connection closed");
      }
    };
  })
);

app.get(
  "/ssh",
  upgradeWebSocket((c) => {
    let sshSocket: TCPSocket | null = null;

    return {
      onMessage: (message: MessageEvent, ws: WSContext) => {
        if (sshSocket && message.data instanceof ArrayBuffer) {
          sshSocket.write(new Uint8Array(message.data));
        } else {
          console.error('Received non-binary data or no SSH connection');
        }
      },
      onOpen: (evt: Event, ws: WSContext) => {
        console.log("SSH connection opened");
        Bun.connect({
          hostname: 'localhost',
          port: 22,
          socket: {
            data(socket, data) {
              ws.send(data);
            },
            error(socket, error) {
              console.error('SSH socket error:', error.message);
              ws.close();
            },
            close() {
              console.log('SSH connection closed');
              ws.close();
            },
            open(socket) {
              console.log('Connected to SSH server');
              sshSocket = socket;
            },
          },
        }).catch(error => {
          console.error('Failed to connect to SSH server:', error);
          ws.close();
        });
      },
      onClose: () => {
        console.log("WebSocket connection closed");
        if (sshSocket) {
          sshSocket.end();
          sshSocket = null;
        }
      },
    };
  })
);

Bun.serve({
  fetch: app.fetch,
  websocket,
  port: 3000,
  hostname: '0.0.0.0',
});

//export default app;
