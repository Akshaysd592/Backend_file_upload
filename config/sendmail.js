const File = require("../models/File");



// This will work only when fileshema having post operation and that is saving some data in database don't need to call it explicitly 
File.post("save",async function(doc){  // doc having the data which is saved 
    try{
        console.log("Doc",doc);

        //transporter

        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });


        //send mail 
     let info = await transporter.sendMail({
        from:`Shunya - by Akshay Dhobale`,
        to :doc.email,
        subject: "New file uploaded on cloudinary",
        html:`<h2>Hello Jee</h2> <p>File Uploaded View Here <a href="${doc.imageUrl}">${doc.imageUrl}</a> </p>`,
     })

     console.log("Info",info);




    }
    catch(error){
        console.log(error);
    }
});
