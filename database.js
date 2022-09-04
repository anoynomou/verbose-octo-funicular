

class DataManager{
    constructor(RAW_FirebaseDatabase ,CONFIGED_firebasdatabase){
        this.database = RAW_FirebaseDatabase
        this.firebasedatabase = CONFIGED_firebasdatabase
    }






    setID(id){
 this.#getName(id).then((data)=>{

    try{
        (this.database !== undefined)?
            this.database.update(this.database.ref(this.firebasedatabase,"AllId/"+id),{
              name:data
            }).then(()=>{
                console.log("Id set Suscessful")
              }).catch(()=>{
                console.log("error")
              })
    
    
            :
            console.log("Database not defign")
        }
        catch(err){
            console.log("Database error")
        }
   

 
 }).catch((exc)=>{
    try{
        (this.database !== undefined)?
            this.database.update(this.database.ref(this.firebasedatabase,"AllId/"+id),{
              name:"No Name"
            }).then(()=>{
                console.log("Id set Suscessful")
              }).catch(()=>{
                console.log("error")
              })
    
    
            :
            console.log("Database not defign")
        }
        catch(err){
            console.log("Database error")
        }
 })


}
 
                



    

    updateName(id,name){
        try{
            (this.database !== undefined)?
                this.database.set(this.database.ref(this.firebasedatabase,"AllId/"+id),{
                    "name":name || "No Name",
                }).then(()=>{
                    console.log("Id set Suscessful")
                  }).catch(()=>{
                    console.log("error")
                  })
        
        
                :
                console.log("Database not defign")
            }
            catch(err){
                console.log("Database error")
            }

    }




    deletID(id){
       

        var userid =  this.database.ref(this.firebasedatabase,"AllId/"+id);
this.database.remove(userid);
    

    }


    #getName(id){
return new Promise((resolve,reject)=>{

    var userid =  this.database.ref(this.firebasedatabase,"AllId/"+id);
    this.database.onValue(userid, (snapshot) => {

        if(snapshot.exists()){
resolve(snapshot.val().name)
        }else{
reject(false)
        }

    })
       
 
    })
}





    getIDS(){

    


    return new Promise((resolve,reject)=>{
        var idsref =    this.database.ref(this.firebasedatabase,"AllId")
        this.database.onValue(idsref, (snapshot) => {
        const data = snapshot.val();
    
        resolve(data)
    
      });


    })
 

    }



}

module.exports = {DataManager}