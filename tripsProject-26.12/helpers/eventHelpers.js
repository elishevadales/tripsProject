const { UserModel } = require("../models/userModel");

// Check if the user has access to the event
export const belongsToUser = async (userId, eventId) => {
    try {
        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return false;
        }

        return user.my_created_events.includes(eventId);

    } catch (error) {
        console.error(error);
        return false;
    }
}