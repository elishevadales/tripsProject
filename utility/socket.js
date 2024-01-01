const { MessageModel } = require("../models/messageModel");
const { EventModel } = require("../models/eventModel");
const { messageValid } = require("../validations/messageValidation");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("new-message", async (messageData) => {
      const validBody = messageValid(messageData);
      const eventId = messageData.event_id;
      const userId = messageData.user_id;
      const text = messageData.text;

      if (validBody.error) {
        socket.emit('error', { type: 'InvalidMessage', details: validBody.error.details });
        return;
      }

      socket.join(eventId);

      try {
        const event = await EventModel.findOne({
          _id: eventId,
          'participants.user_id': userId
        });

        if (!event) {
          socket.emit('error', { type: 'EventNotFound', msg: 'Event not found or user not a participant' });
          return;
        }

        const newMessage = new MessageModel(messageData);
        await newMessage.save();

        io.to(eventId).emit('new-message', { userId, text });
        console.log(`${userId}: ${text}`);
      } catch (err) {
        console.error(err);
        socket.emit('error', { type: 'ServerError', msg: 'Internal server error' });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};

module.exports = { initSocket };
