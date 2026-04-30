const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Kutoa faili za frontend (HTML/CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Tunapotumia Socket.io
io.on('connection', (socket) => {
    console.log('Mtumiaji amejiunga:', socket.id);

    // Kumsikiliza mtumiaji anapojiunga na kumpa jina
    socket.on('join_chat', (username) => {
        socket.username = username;
        // Kuwajulisha wengine mtu amejiunga
        socket.broadcast.emit('user_joined', `${username} ameingia chatini.`);
    });

    // Kupokea ujumbe kutoka kwa mtumiaji
    socket.on('send_message', (data) => {
        // Kutuma ujumbe kwa wote walioko chatini (pamoja na mtumaji)
        io.emit('receive_message', {
            sender: data.sender,
            message: data.message,
            time: new Date().toLocaleTimeString()
        });
    });

    // Mtumiaji anapotoka
    socket.on('disconnect', () => {
        if(socket.username) {
            io.emit('user_left', `${socket.username} ametoka chatini.`);
        }
    });
});

// Server kuanza kusikiliza
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server ya SecureChat inaendesha kwenye: http://localhost:${PORT}`);
}); 
