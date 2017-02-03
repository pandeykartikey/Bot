var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
var task=[];
var i=-1;

bot.dialog('/',intents
    .matches(/^add task/i, '/add')
    .matches(/^show task/i, '/show')
    .matches(/^remove task/i, '/remove')
);





intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);


bot.dialog('/show', [

    function (session) {
    	session.send('Task yet to be completed are -->')
    	for (var j = i; j >= 0; j--) {
    	session.send('%s',task[j]);
    	}
    	session.send('What do you want to do now? %s!', session.userData.name);

}
]);


bot.dialog('/remove', [
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
         session.beginDialog('/remove more');

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
        session.send('What do you want to do now? %s!', session.userData.name);
    	intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
    }
]);

bot.dialog('/add', [
    function (session) {
        builder.Prompts.text(session, 'What do you want to add?');
    },
    function (session, results) {
        task.push(results.response);
        i++;
        session.send('Ok... Your task has been added %s', task[i]);
        session.endDialog();
        session.beginDialog('/add more');

    }
]);

bot.dialog('/add more',[
	function(session){
		builder.Prompts.text(session,'Do you want to add anything more ?(yes/no)');
	},
	function(session,results){
		var res =results.response;
		if(res=='yes'){
			session.beginDialog('/add');
		}
		else if(res=='no'){
			session.endDialog();
			session.send('What do you want to do now? %s!', session.userData.name);
		}
		else{
			session.send("I'm sorry. I didn't understand.");
			session.beginDialog('/add more');
		}
	}
	]);


bot.dialog('/remove more',[
	function(session){
		builder.Prompts.text(session,'Do you want to remove anything more ?(yes/no)');
	},
	function(session,results){
		var res =results.response;
		if(res=='yes'){
			session.beginDialog('/remove');
		}
		else if(res=='no'){
			session.endDialog();
			session.send('What do you want to do now? %s!', session.userData.name);
		}
		else{
			session.send("I'm sorry. I didn't understand.");
			session.beginDialog('/remove more');
		}
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
