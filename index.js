const Telegraf = require('telegraf')
const telegram = require('telegram-bot-api')
//const TelegramBot=require('node-telegram-bot-api');
const TelegrafFlow = require('telegraf-flow')
const { Scene } = TelegrafFlow
const TOKEN = '801358342:AAGeXMEPYFxpXm-WxvzUGx7t5oxFdlPnVT0';
const flow = new TelegrafFlow()
var username;


// scenes
const ageScene = new Scene('age')
ageScene.enter((ctx) => {ctx.reply('Enter your Age');})
ageScene.on('message', (ctx) => {
    let age=ctx.message.text;
    ctx.flow.state.age=age; //saving the variable
    ctx.flow.enter('gender',ctx.flow.state);//move to the next scene with the saved variable
})

const genderScene = new Scene('gender')
genderScene.enter((ctx) => ctx.reply('Enter your Gender'))
genderScene.on('message', (ctx) => {
    let gender = ctx.message.text;
    ctx.flow.state.gender = gender;//saving the variable
    ctx.flow.enter('symptom', ctx.flow.state);//move to the next scene with the saved variable

})

const symptomScene = new Scene('symptom')
symptomScene.enter((ctx) => {ctx.reply('Enter your Medical Questions')})
symptomScene.on('message', (ctx) => {
    let symptom = ctx.message.text;
    ctx.flow.state.symptom = symptom;//saving the variable
    ctx.reply('Thank You for your inquiry, we will get back to you soon!')
    ctx.flow.enter('send',ctx.flow.state);//move to the next scene with the saved variable

})

const sendScene = new Scene('send')
sendScene.enter((ctx) => {
    let age = ctx.flow.state.age;//retriving the data
    let gender = ctx.flow.state.gender;//retriving the data
    let symptom = ctx.flow.state.symptom;//retriving the data
    userid = ctx.from.id;//retriving the username 
    let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
    ctx.telegram.sendMessage(337054173,data);//me
/*
    if(userid%10==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(337054173,data);//me
        }
    else if(userid%9==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(337054173,data);
        }
    else if(userid%8==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);//baharu
        }
    else if(userid%7==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(326568244,data);//si
        }
    else if(userid%6==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);
        }
    else if(userid%5==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);
        }
    else if(userid%4==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);
        }
    else if(userid%3==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);
        }
    else if(userid%2==0){
        let data = 'ID: '+userid + "\n"+'Age: '+age+"\n"+'Gender: '+gender+"\n"+'Symptom: '+symptom;
        ctx.telegram.sendMessage(334624780,data);
        }
    */
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//feedback message
const patientIdScene = new Scene('patientId')
patientIdScene.enter((ctx) => {ctx.reply('Enter the Id of your patient');})
patientIdScene.on('message', (ctx) => {
    let patientId=ctx.message.text;
    ctx.flow.state.patientId=patientId; //saving the variable
    ctx.flow.enter('feedback',ctx.flow.state);//move to the next scene with the saved variable
})

const feedbackScene = new Scene('feedback')
feedbackScene.enter((ctx) => {ctx.reply('Enter your Diagnosis');})
feedbackScene.on('message', (ctx) => {
    let feed=ctx.message.text;
    ctx.flow.state.feed=feed; //saving the variable
    ctx.flow.enter('replys',ctx.flow.state);//move to the next scene with the saved variable
})

const replyScene = new Scene('replys')
replyScene.enter((ctx) => {
    let feed = ctx.flow.state.feed;//retriving the data
    let patientId=ctx.flow.state.patientId;
    //console.log(username);
    let data = 'The diagnosis and treatment is as follows: '+ "\n"+feed ;
    ctx.telegram.sendMessage(patientId,data);
})

// Scene registration

flow.register(ageScene)
flow.register(genderScene)
flow.register(symptomScene)
flow.register(sendScene)
flow.register(patientIdScene)
flow.register(feedbackScene)
flow.register(replyScene)

const bot = new Telegraf(TOKEN)
// Flow requires valid Telegraf session
bot.use(Telegraf.session())
bot.use(flow.middleware())
bot.command('start', (ctx) => {ctx.reply('welcome!'); console.log('started from:'+ctx.from.id); ctx.flow.enter('age'); })
bot.command('reply', (ctx) => {ctx.reply('Doctors Welcome!'); console.log('started from:'+ctx.from.id); ctx.flow.enter('patientId'); })
bot.startPolling()