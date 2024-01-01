
const indexR = require("./index");
const usersR = require("./users");
const eventsR = require("./events");
const messageR = require("./messages")
const reviewR = require("./review")

exports.routesInit = (app) => {

    app.use('/', indexR)
    app.use('/users', usersR)
    app.use('/events', eventsR)
    app.use('/reviews', reviewR)
    app.use('/messages', messageR)
}