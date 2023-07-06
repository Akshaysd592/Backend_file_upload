const express = require("express");
const app = express();

require("dotenv").config()
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
//using express file-upload as a middleware
const fileupload = require("express-fileupload");

app.use(fileupload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));


// db connection
const db = require("./config/database");
db.dbconnect();


//cloudconnection
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();


// api routes mount 
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload",Upload);



app.get("/",(req,res)=>{
    res.send("Hello ji this is home page ")
})



app.listen(PORT,()=>{
    console.log(`Server is started at port ${PORT} `)
})