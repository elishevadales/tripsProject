
const indexR = require("./index");
const usersR = require("./users");
const eventsR = require("./events");

exports.routesInit = (app) => {

    app.use('/', indexR)
    app.use('/users', usersR)
    app.use('/events', eventsR)
}