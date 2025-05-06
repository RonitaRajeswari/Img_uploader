import express from "express";
import mongoose from "mongoose";
import path from 'path'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';


const app = express();

cloudinary.config({ 
    cloud_name: 'dnkz1ouky', 
    api_key: '933561193668452', 
    api_secret: 'KgnBmeRy3h_BdihHon5nVDzE7fc' 
});


mongoose
  .connect(
    "mongodb+srv://rajeswarimahapatra40:onXaow2NFUJ125M6@cluster0.oliutah.mongodb.net/",
    {
      dbName: "nodeJSLearn",
    }
  )
  .then(() => console.log("MongoDb Connected ..!"))
  .catch((err) => console.log(err));

  //rendering ejs file
  app.get('/', (req,res)=> {
    res.render('index.ejs', {url:null})
  })


  const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + path.extname(file.originalname)
      cb(null, file.fieldname + "-" + uniqueSuffix)
    },
  })
  
  const upload = multer({ storage: storage })

  const imageSchema = new mongoose.Schema({
        filename: String,
        public_id: String,
        imgUrl: String,
  });

const File = mongoose.model("cloudinary", imageSchema)


  app.post('/upload', upload.single('file'), async (req, res)=> {
    const file =  req.file.path
    const cloudinaryRes = await cloudinary.uploader.upload(file, {
        folder: "NodeJs_learn"
    })

    //save to database
    const db = await File.create({
        filename: file.originalname,
        public_id: cloudinaryRes.public_id,
        imgUrl : cloudinaryRes.secure_url,
    })

    res.render("index.ejs",{url:cloudinaryRes.secure_url})
    // res.json({message: "file uploaded successfully", cloudinaryRes})
  })



const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));
