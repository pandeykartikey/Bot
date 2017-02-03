var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);


intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.matches(/^Add task/i, [
    function (session) {
        session.beginDialog('/task');
    },
    function (session, results) {
        session.send('Ok... Changed your task has been added %s', session.userData.task);
    }
]);

intents.matches(/^Show task/i, [

    function (session) {
        session.send('Ok... Changed your task is  %s', session.userData.task);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/task', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your task?');
    },
    function (session, results) {
        session.userData.task = results.response;
        session.endDialog();
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
