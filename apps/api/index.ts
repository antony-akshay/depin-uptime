import express from "express";
import {  authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();

app.use(express.json());

// to create a website
app.post("/api/v1/website", authMiddleware,async (req, res) => {
    const userId = req.userId!;
    const { url } = req.body;  
    
    const data = await prismaClient.website.create({
        data:{
            userId,
            url
        }
    })

    res.json({
        id: data.id
    })
})

// ticks of website
app.get("/api/v1/website/status", authMiddleware, async(req, res) => {
    const websiteId = req.query.websiteId! as unknown as string;
    const userId = req.userId!;

    const data = await prismaClient.website.findFirst({
        where:{
            id : websiteId,
            userId,
            disabled:false
        },
        include:{
            ticks:true,
        }
    })

    res.json(data)
})

// return all websites
app.get("/api/v1/websites", authMiddleware, async(req, res) => {
    const userId = req.userId!;

    const websites = await prismaClient.website.findMany({
        where:{
            userId,
            disabled:false
        }
    })

    res.json(websites)
})

// delete website
app.delete("/api/v1/website/:websiteId", authMiddleware, async  (req, res) => {
    const websiteId = req.body.websiteId;
    const userId = req.userId!;

    await prismaClient.website.update({
        where:{
            id:websiteId,
            userId
        },
        data:{
            disabled:true
        }
    })

    res.json({
        message:"deleted message successfully"
    })

})


app.listen(3000);

