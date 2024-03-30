const createServer = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("Testing Socket.io", () => {

    let io, serverSocket, clientSocket;

    //ANTES DE EMPEZAR A HACER LOS TESTS, CREAMOS EL SERVIDOR
    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);

        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);

            io.on("connection", (socket) => {
                serverSocket = socket;
            });

            clientSocket.on("connect",done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });
});