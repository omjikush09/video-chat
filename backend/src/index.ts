import express, {Express,Request,Response} from "express"
import http from "http"
import cors from "cors"
import route from "./route"
import {Server} from "socket.io"
const app:Express =express();
const server=http.createServer(app)



const io=new Server(server,{
    cors:{
        origin: "*",
    }
})

app.use(cors())

app.get("/",(req:Request,res:Response)=>{
    res.send("hello welcome to server")
})

app.use(route)
// app.get("/get",(req:Request,res:Response)=>{
//     res.send("hello this is get route")
// })
// app.get("/set",(req:Request,res:Response)=>{
//     res.send("hello this is set route")
// })

io.on("connection",(socket)=>{
    socket.emit("me",socket.id);
    socket.on("disconnect",()=>{
        socket.broadcast.emit("callended")
    })
    socket.on("calluser",({userToCall,signalData,from ,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})
    })
    socket.on("answercall",(data)=>{
        io.to(data.to).emit("callaccepted",data.signal)
    })
})






const port = process.env.PORT || 8000
server.listen(port,()=>{
    console.log("Server is running")
})