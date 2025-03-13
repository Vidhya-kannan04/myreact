const express = require('express');
const cors = require('cors');
const fs=require("fs");
const users=require("./sample.json")
const app=express();
app.use(express.json());
const port=8000;

app.use(express.json());
app.use(cors());

app.use(cors({
        methods:["GET","POST","PUT","DELETE","PATCH"],
    }));
   
//app.use(express.json());

app.listen(port,(err)=>{
    console.log(`app is running in port ${port}`);
});
//get all users
app.get("/users",(req,res)=>{
    return res.json(users);
    });

    //delete users
app.delete("/users/:id",(req,res)=>{
    let id=Number(req.params.id);
    let filteredUsers=users.filter((user)=>user.id!==id);
    fs.writeFile("./sample.json",JSON.stringify(filteredUsers,null,2),(err)=>{
         return res.json(users);
    });
   
    });

    //add users

    app.post("/users",(req,res)=>{
let {name , age , city}=req.body;
if(!name || !age || !city){
    return res.status(400).json({message:"please enter all the fields"});
}
let id=users.length+1;
users.push({id,name,age,city});
fs.writeFile("./sample.json",JSON.stringify(users,null,2),(err)=>{
    return res.json({ message: "user added successfully" });
});

    });


    //update user
    app.patch("/users/:id",(req,res)=>{
        let id=Number(req.params.id);
        let {name , age , city}=req.body;
        if(!name || !age || !city){
            return res.status(400).json({message:"please enter all the fields"});
        }
        
        let index=users.findIndex((user)=>user.id==id);
        users.splice(index,1,{...req.body});
        fs.writeFile("./sample.json",JSON.stringify(users,null,2),(err)=>{
            return res.json({ message: "user updated successfully" });
        });
        
            });
        