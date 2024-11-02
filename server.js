const http = require("http");
const express = require("express");
const {Server} = require("socket.io")
const randomstring = require("randomstring")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

var rooms=[];

app.use(express.static(__dirname + '/public'));
// Url requests
app.get('/',(req,res)=>{
    res.render()
    res.sendFile(__dirname+"/public/index.html");
});

app.get('/room',(req,res)=>{
    var code = randomstring.generate(7);
    rooms.push(code);
    res.redirect("/room/"+code);
});

app.get('/room/:code',(req,res)=>{
    if(rooms.includes(req.params.code)){
        res.sendFile(__dirname+"/public/room.html");
    }else{
        res.sendFile(__dirname+"/public/error.html");
    }
    
});



// Socket io connections
io.on('connection', (socket) => {
    console.log("New user connected " + socket.id);

    // Handle room joining
    socket.on("room", (code,username) => {
        socket.join(code);
        socket.to(code).emit("message", "System", username+" joined the chat");
        // Handle message sending
    socket.on("message", (sender, message) => {
        // Get the first room the user is in, if any
        console.log("message received for "+code)
        if (code) {
            console.log(code);
            socket.to(code).emit("message", sender, message);
        } else {
            console.log("No room found for this user.");
        }
    });
    });
    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected " + socket.id);
    });
});
server.listen(9000,()=>{
    console.log("Server Running at port 9000");
});
