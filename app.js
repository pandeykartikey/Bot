var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

function details(session) {
    this.head = "";
    this.t = 0;
    this.stop;
    this.it = 0;
    this.start = function() {
        var to = this.t*1000*60*60*24;
        var h1 = this.head;
        var it1 = this.it;
        this.stop = setTimeout(function() {1000*60*60*24
            session.send(h1);
            i--;
            time.splice(it1, 1);
        }, to);
    }
};
var task;
var time = [];
var i = -1;

bot.dialog('/', intents
    .matches(/^add task/i, '/add')
    .matches(/^show task/i, '/show')
    .matches(/^remove task/i, '/remove')
);


bot.dialog('/show', [
    function(session){
        builder.Prompts.text(session,'Which days task you want to see?'); 
    },
    function(session,results) {
        if(results.response=='all'){
        if (i > 0) {
            session.send('Task yet to be completed are -->')
            for (var j = i; j >= 0; j--) {
                session.send('%s', time[j].head);
            }
        } else {
            session.send('No task remaining');
        }}
        else{
            var da=results.response;
            var today= new Date();
        var yr =da.substr(0,4);
        var month= da.substr(5,2);
        var day=da.substr(8,2);
        var y2k  = new Date(yr, month-1, day);
        var diff=Date.daysBetween(today,y2k);
            session.send('Task yet to be completed on %s are -->',da);
         for (var j = i; j >= 0; j--) {
                if(diff==time[j].t){
                session.send('%s', time[j].head);}
            }
        }
        session.send('What do you want to do now? %s!', session.userData.name);
        session.endDialog();

    }
]);


bot.dialog('/remove', [
    function(session) {
        builder.Prompts.text(session, 'Which task have you completed?');
    },
    function(session, results) {
        var rem = results.response;
        var index = -1;
        for (var j = 0; j <= i; j++) {
            if (time[i].head === rem) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            session.send("Task does not exist");
        } else {
            clearTimeout(time[index].stop);
            time.splice(index, 1);
            i--;
            session.send('Ok... Changed your task has been removed');

        }
        session.endDialog();
        session.beginDialog('/remove more');

    }
]);


intents.onDefault([
    function(session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function(session, results) {
        session.send('What do you want to do now? %s!', session.userData.name);
        intents.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
    }
]);

bot.dialog('/add', [
    function(session) {
        builder.Prompts.text(session, 'What do you want to add?');
    },
    function(session, results) {
        i++;
        
        task = results.response;
        session.send('Ok... Your task has been added %s', task);
        builder.Prompts.text(session, 'Tell the due date?');
    },
    function(session, results) {
        time.push(new details(session));
        time[i].head = task;
        var  da=results.response;
        var today= new Date();
        var yr =da.substr(0,4);
        var month= da.substr(5,2);
        var day=da.substr(8,2);
        var y2k  = new Date(yr, month-1, day); 
        time[i].t =Date.daysBetween(today,y2k); 
        time[i].it = i;
        time[i].start();
        session.endDialog();
        session.beginDialog('/add more');

    }
]);
Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();
  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
}


bot.dialog('/add more', [
    function(session) {
        builder.Prompts.text(session, 'Do you want to add anything more ?(yes/no)');
    },
    function(session, results) {
        var res = results.response;
        if (res == 'yes') {
            session.beginDialog('/add');
        } else if (res == 'no') {
            session.endDialog();
            session.send('What do you want to do now? %s!', session.userData.name);
        } else {
            session.send("I'm sorry. I didn't understand.");
            session.beginDialog('/add more');
        }
    }
]);


bot.dialog('/remove more', [
    function(session) {
        builder.Prompts.text(session, 'Do you want to remove anything more ?(yes/no)');
    },
    function(session, results) {
        var res = results.response;
        if (res == 'yes') {
            session.beginDialog('/remove');
        } else if (res == 'no') {
            session.endDialog();
            session.send('What do you want to do now? %s!', session.userData.name);
        } else {
            session.send("I'm sorry. I didn't understand.");
            session.beginDialog('/remove more');
        }
    }
]);


bot.dialog('/profile', [
    function(session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function(session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
