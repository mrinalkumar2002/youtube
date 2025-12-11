import express from "express"
import { SaveData,Getdata,Filter,Search,videoId } from "../Controller/Data.controller.js"

const router=express.Router()

router.post("/savedata",SaveData)
router.get("/getdata",Getdata)
router.get("/filter",Filter)
router.get("/search",Search)
router.get("/video/:videoId",videoId)





export default router;


