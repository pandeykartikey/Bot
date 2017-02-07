//requirejs(['node_modules/botbuilder/lib/botbuilder'], function (builder) {
var builder = require('botbuilder');
var restify = require('restify');
require('dotenv-extended').load();
//var builder = require('botbuilder');

var model = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/950a741a-7337-4eea-8f63-ea622066429e?subscription-key=415910ca343a4c4f8804c8c6889d90f9&verbose=true";
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "38890b5f-cad3-4b50-b10f-06b49e4233b3",
    appPassword: "0fTV4OnK4j8xo9OHLB7q6Ro"
});

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

server.post('/api/messages', connector.listen());


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
var temp;
var time = [];
var i = -1;
var name;

bot.dialog('/', dialog
    .matches('Add Task', '/add')
    .matches('Show tasks', '/show')
    .matches('Remove task', '/remove')
    .matches('None','/none')
    .matches('Greetings','/greet')
);


bot.dialog('/show', [
    function(session){
        builder.Prompts.text(session,'Which days task you want to see?'); 
    },
    function(session,results) {
        if(results.response=='all'){
        if (i > -1) {
            session.send('Task yet to be completed are -->')
            for (var j = i; j >= 0; j--) {
                session.send('%s', time[j].head);
            }
        } else {
            session.send('No task remaining');
        }}
        else{
var  da=results.response;
        var reg=/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/ ;
        if(da.match(reg)==null){
        builder.Prompts.text(session, 'Please send the date in the format dd/mm/yyyy or dd-mm-yyyy')
        session.beginDialog('/date');
        }
        else{
        var today= new Date();
        var yr =da.substr(6,4);
        var month= da.substr(3,2);
        var day=da.substr(0,2);
        var y2k  = new Date(yr, month-1, day); 
        temp =Date.daysBetween(today,y2k);
        }
        var diff=temp;
            session.send('Task yet to be completed on %s are -->',da);
         for (var j = i; j >= 0; j--) {
                if(diff==time[j].t){
                session.send('%s', time[j].head);}
            }
        }
        session.send('What do you want to do now? %s!', name);
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


bot.dialog('/greet',[
    function(session, args, next) {
        if (!name) {
            session.send('Hi');
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function(session, results) {
        session.send('Hi!...What do you want to do now? %s!', name);
        session.endDialog();
    }
]);
bot.dialog('/none',[
    function(session){
        session.send("I'm sorry. I didn't understand.");
        session.endDialog();
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
        time.push(new details(session));
        //session.send('Tell the due date?');
        session.beginDialog('/date');},
        function(session){
        time[i].head = task;
        /*var  da=results.response;
        var today= new Date();
        var yr =da.substr(0,4);
        var month= da.substr(5,2);
        var day=da.substr(8,2);
        var y2k  = new Date(yr, month-1, day); 
        time[i].t =Date.daysBetween(today,y2k);*/ 
        time[i].t=temp;
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
            session.send('What do you want to do now? %s!', name);
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
            session.send('What do you want to do now? %s!', name);
        } else {
            session.send("I'm sorry. I didn't understand.");
            session.beginDialog('/remove more');
        }
    }
]);


bot.dialog('/profile', [
    function(session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function(session, results) {

        var t=String(results.response);
        var rege=/^[a-zA-Z]*$/ ;
        if(t.match(rege)==null){
        session.send( 'Strange one, please enter a name that contains only alphabets! ')
        session.beginDialog('/profile');
        }
        else{
        name=t;
        session.endDialog();
    }}
]);
//});
bot.dialog('/date',[
    function(session) {
        builder.Prompts.text(session,'Tell the due date ?');
    },
    function(session, results) {
            var  da=String(results.response);
        var reg=/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/ ;
        if(da.match(reg)==null){
        session.send ('Please send the date in the format dd/mm/yyyy or dd-mm-yyyy');
        session.beginDialog('/date');
       }
        else{
        var today= new Date();
        var yr =da.substr(6,4);
        var month= da.substr(3,2);
        var day=da.substr(0,2);
        var y2k  = new Date(yr, month-1, day); 
        temp =Date.daysBetween(today,y2k);
        session.endDialog();
     }
    }]);
