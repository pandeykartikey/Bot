var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);
var task=[];
var i=-1;

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
        session.send('Ok... Your task has been added %s', task[i]);
    }
]);

intents.matches(/^Show task/i, [

    function (session) {
    	session.send('Task yet to be completed are -->')
    	for (var j = i; j >= 0; j--) {
    	session.send('%s',task[j]);
    }}
]);

intents.matches(/^remove task/i, [
    function (session) {
        session.beginDialog('/task1');
    }
]);

bot.dialog('/task1', [
    function (session) {
        builder.Prompts.text(session, 'Which task have you completed?');
    },
    function (session, results) {
        var rem =results.response;
        var index=task.indexOf(rem);
        if(index==-1){
         session.send("Task does not exist");}
         else {
         	task.splice(index, 1);
         	i--;
         	session.send('Ok... Changed your task has been removed');
         }
        session.endDialog();
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
        session.send('What do you want to do? %s!', session.userData.name);
    }
]);

bot.dialog('/task', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What do you want to add?');
    },
    function (session, results) {
        task.push(results.response);
        i++;
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
