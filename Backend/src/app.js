const express = require("express")
const noteModel = require("./models/note.model")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"../public")))

app.post("/api/notes",async(req,res)=>{
    const {title,description}=req.body

    const notes = await noteModel.create({
        title:title,
        description:description
    })
    res.status(201).json({
        Message:"Note created successfully",
        notes
    })
})

app.get("/api/notes",async(req,res)=>{
    const notes = await noteModel.find()
    res.status(200).json({
        Message:"Notes fetched successfully",
        notes
    })
})

app.delete("/api/notes/:id",async(req,res)=>{
    const {id} = req.params
    await noteModel.findByIdAndDelete(id)
    res.status(200).json({
        Message:"Note deleted successfully"
    })
})

app.patch("/api/notes/:id",async(req,res)=>{
    const id = req.params.id
    const {title, description} = req.body
    await noteModel.findByIdAndUpdate(id,{title, description})
    res.status(200).json({
        Message:"Note updated successfully"
    })
})

app.get("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
})

module.exports = app