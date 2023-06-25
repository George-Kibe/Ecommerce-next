import multer from "multer"
//uploading photos to s3
const photosMiddleware = multer({dest:"/tmp"})
app.post("/api/upload", photosMiddleware.array("photos", 100), async(req,res) => {
    //console.log(req.files)
    try {
        const uploadedFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            //console.log(req.files[i])
            const {path, originalname, mimetype} = req.files[i]
            const url = await uploadToS3(path, originalname, mimetype);
            uploadedFiles.push(url)
        }
        res.status(201).json(uploadedFiles)
    } catch (error) {
        res.status(422).json("Unprocessable Entry!");
        return
    }
})