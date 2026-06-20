const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 8080;
const SHOWDOWN_WS = 'wss://sim3.psim.us/showdown/websocket';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bridge Online');
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (azureWs) => {
    const showdownWs = new WebSocket(SHOWDOWN_WS);
    azureWs.on('message', (msg) => { if (showdownWs.readyState === WebSocket.OPEN) showdownWs.send(msg.toString()); });
    showdownWs.on('message', (msg) => { if (azureWs.readyState === WebSocket.OPEN) azureWs.send(msg.toString()); });
    azureWs.on('close', () => showdownWs.close());
    showdownWs.on('close', () => azureWs.close());
});
server.listen(PORT);
