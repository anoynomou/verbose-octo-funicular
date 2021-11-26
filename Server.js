const { json } = require("express");
var Express = require("express")
var App = Express()
var PORT = process.env.PORT || 4000;
var http = require("http")
var server = http.createServer(App).listen(PORT)
var socket = require('socket.io')(server)

var path = require('path')

App.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"\ viewe".trim(),"\ index.html".trim()))
    
})

App.get('/rat',(req,res)=>{
    res.sendFile(path.join(__dirname,"\ viewe".trim(),"\ rat.html".trim()))
    
})

socket.on('connection',Socket=>{
    console.log(Socket.id)

    Socket.on('cmd',valu=>{
        console.log(valu)
        Socket.to(valu.room).emit('data',valu.data)
    })



    Socket.on('join_room',(roomid)=>{
         console.log(roomid)
         
         Socket.join(roomid)
     })


     Socket.on("msg",(data)=>{
         console.log(data)
        Socket.broadcast.emit("msg", data);
     })

    // socket.emit("new message","hi i am server")
    Socket.on('disconnect',()=>{
        console.log("user disconnet")
    })

})