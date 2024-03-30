const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("Testing Socket.io", () => {

    let io, serverSocket, clientSocket;

    //ANTES DE EMPEZAR A HACER LOS TESTS, CREAMOS EL SERVIDOR
    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        //console.log(io);

        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);

            io.on("connection", (socket) => {
                serverSocket = socket;
            });

            //console.log(io);
            clientSocket.on("connect",done);
        });
    });

    afterAll(() => {
        
        io.close();
        clientSocket.close();
    });

    test("test event", (done) => {
        clientSocket.on("greeting", (greet) => {
            try {
                expect(greet).toBe("hola mundo");
                done();
            } catch (error) {
                done(error);
            }
        });

        serverSocket.emit("greeting","hola mundo");
    });

    test("Testing callbacks (acknoledgements)", (done) => {
        
        serverSocket.on("bark", (callback) => {
            callback("uya");
        });

        clientSocket.emit("bark",(arg) => {
            try {
                expect(arg).toBe("uya");
                done();
            }catch (error) {
                done(error);
            }   
        })
    });
});