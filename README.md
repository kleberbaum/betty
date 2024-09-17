# betty: WebSocket Server for Remote Access and Command Execution

## Project Overview

betty is a WebSocket server implemented using the Hono framework and Bun runtime. It provides two main endpoints for remote access and command execution:

1. `/shell`: Executes shell commands on the server
2. `/ssh`: Provides SSH tunneling over WebSocket

## Setup Instructions

1. **Prerequisites:**
   - Install [Bun](https://bun.sh/) runtime
   - Ensure you have Git installed

2. **Clone the repository:**
   ```
   git clone https://github.com/netsnek/betty-pylon.git
   cd betty-pylon
   ```

3. **Install dependencies:**
   ```
   bun install
   ```

4. **Configure the server:**
   - Open `src/index.ts` and adjust any configuration settings if needed (e.g., port number)

5. **Run the server:**
   - For development:
     ```
     bun run dev
     ```
   - For production:
     ```
     bun run build
     ```

The server will start and listen on `0.0.0.0:3000` by default.

## Key Features

- Built with Hono framework and Bun runtime for high performance
- Handles binary data transmission for SSH protocol
- Implements raw TCP stream forwarding for SSH connections
- Command validation and execution for the `/shell` endpoint
- Comprehensive error handling and logging

## Security Considerations

- The `/shell` endpoint has a list of allowed commands to prevent unauthorized actions
- SSH connections are tunneled through WebSocket, providing an additional layer of abstraction

## Usage

The server listens on `0.0.0.0:3000` and can be accessed via WebSocket connections. Clients can connect to either the `/shell` or `/ssh` endpoints based on their needs.

## Test Execution Guidelines

To run the tests for betty:

1. Ensure you're in the project root directory.
2. Run the following command:
   ```
   bun test
   ```

This will execute all test files in the project. For more specific test runs or additional options, refer to the Bun documentation on testing.

## Note

betty is designed for specific use cases where traditional SSH access might be restricted. Always ensure proper security measures are in place when deploying in production environments.
