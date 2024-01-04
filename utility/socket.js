const { MessageModel } = require("../models/messageModel");
const { EventModel } = require("../models/eventModel");
const { messageValid } = require("../validations/messageValidation");
const { UserModel } = require("../models/userModel");

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔥: A user connected");

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`⚡: User ${socket.id} joined room ${roomId}`);
    });

    socket.on("new-message", async (messageData) => {
      console.log(messageData)
      const validBody = messageValid(messageData);
      const eventId = messageData.event_id;
      const userId = messageData.user_id;
      const text = messageData.text;

      // if (validBody.error) {
      //   console.log(`🚀: ${validBody.error.details}`)
      //   socket.emit('error', { type: 'InvalidMessage', details: validBody.error.details });
      //   return;
      // }

      socket.join(eventId);

      try {
        // const event = await EventModel.findOne({
        //   _id: eventId,
        //   'participants.user_id': userId
        // });

        // if (!event) {
        //   socket.emit('error', { type: 'EventNotFound', msg: 'Event not found or user not a participant' });
        //   return;
        // }
        const { nick_name, profile_image } = await UserModel.findById(messageData.user_id)
        const newMessage = await MessageModel.create(messageData);
        const _id = newMessage.user_id
        const message = {... newMessage._doc, user_id:{
          _id,
          profile_image,
          nick_name
        }}
       
        io.to(eventId).emit('new-message', message);


        console.log(`🚀: new message ${newMessage.text}`);
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
