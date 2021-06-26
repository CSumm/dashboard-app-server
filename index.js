const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
var CronJob = require('cron').CronJob;
const port = 3001;


const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });  

    var job = new CronJob('*/1 * * * *', function() {
      let min = 25;
      let max = 29;
      let waterLevel = (Math.random() * (max-min)+min).toFixed(2);
      let warning = '';
      let date = new Date();
      let timeOfDay = `${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
      let timeOfYear = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;


      if(waterLevel >= 28){
        warning = `${timeOfYear} ${timeOfDay} - water level is too high for this time of year. Take immediate flooding prevention measures`;
      }
      else if(waterLevel < 26){
        warning = `${timeOfYear} ${timeOfDay} - water level is too low. Avoid boating on the river at this time`;
      }
      else {
        warning = '';
      }

      let obj = {waterLevel:waterLevel,warning:warning}
      ws.send(JSON.stringify(obj));
    

}, null, true, 'America/New_York');
job.start();
  });

  app.get('/', (req,res) => res.send("hello world"));
  server.listen(process.env.PORT || port, () => console.log(`Listening on port ${port}`));