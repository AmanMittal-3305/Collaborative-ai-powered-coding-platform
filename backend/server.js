import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.use(async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        // Validate projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        // Find the project by projectId
        socket.project = await projectModel.findById(projectId);

        // Handle case when project is not found
        if (!socket.project) {
            return next(new Error('Project not found'));
        }

        // Check if the token is present
        if (!token) {
            return next(new Error('Authentication error'));
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Authentication error'));
        }

        socket.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', (socket) => {
    // Ensure that socket.project is valid before accessing its _id
    if (socket.project) {
        socket.roomId = socket.project._id.toString();
        console.log(`User connected to project: ${socket.roomId}`);
    } else {
        console.log('No project found for this socket');
        return;
    }

    console.log('A user connected');
    socket.join(socket.roomId);

    socket.on('project-message', async (data) => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data);

        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '');
            const result = await generateResult(prompt);

            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI',
                },
            });

            return;
        }
    });

    socket.on('code-change', ({ code }) => {
        socket.broadcast.to(socket.roomId).emit('code-change', code);
    });

    socket.on('code-update', ({ fileName, content, senderId }) => {
        socket.broadcast.to(socket.roomId).emit('code-update', { fileName, content, senderId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
