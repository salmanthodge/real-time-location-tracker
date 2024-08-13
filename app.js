const express = require("express")
const app = express()
const http = require("http")
const path = require("path")

const socketio = require("socket.io")

const server = http.createServer(app)

const io = socketio(server)

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")))

io.on("connect",function(socket){
    socket.on("send-location",function(data){
        io.emit("recieve-location", { id: socket.id, ...data})
    })

    socket.on("disconnected", function(){
        io.emit("user-disconnected",socket.id)
    })
})

app.get("/", function(req,res){
    res.render("index");
})

server.listen(3000,'0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
})