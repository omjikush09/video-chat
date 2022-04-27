import {Router,Request,Response} from "express";


const router=Router();
router.get("/route",(req:Request,res:Response)=>{
    res.send("hello route")
})


export default router;