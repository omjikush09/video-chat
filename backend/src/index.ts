import express, {Express,Request,Response} from "express"

import route from "./route"

const app:Express =express();

app.get("/",(req:Request,res:Response)=>{
    res.send("hello welcome to server")
})

app.use(route)
app.get("/get",(req:Request,res:Response)=>{
    res.send("hello this is get route")
})
app.get("/set",(req:Request,res:Response)=>{
    res.send("hello this is set route")
})
const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log("Server is running")
})