

class DataManager{
    constructor(RAW_FirebaseDatabase ,CONFIGED_firebasdatabase){
        this.database = RAW_FirebaseDatabase
        this.firebasedatabase = CONFIGED_firebasdatabase
    }


    setID(id,name){

        var userName = name ? name : "No Name"

        try{
    (this.database !== undefined)?

        

        this.database.set(this.database.ref(this.firebasedatabase,"AllId/"+id),{
            "name":userName,
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