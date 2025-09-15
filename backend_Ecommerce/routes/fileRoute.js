import express from 'express';
import multer from 'multer';
import {MongoClient, GridFSBucket} from 'mongodb'
import mongoose from 'mongoose';

const router = express.Router();

const dbName = 'DHKPTSocial';

const upload = multer();

let db;
const client = new MongoClient('mongodb+srv://root:admin123456@socialmediamern.geor3.mongodb.net/?retryWrites=true&w=majority&appName=SocialMediaMERN');
client.connect().then(() => {
  db = client.db(dbName);
});

// Tải lên file cho sản phẩm
router.post('/upload', upload.single('file'), (req, res) => {
  const productId = req.body.productId;
  const bucket = new GridFSBucket(db);
  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    metadata: { productId: productId}
  });
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    const fileInfo = {
      _id: uploadStream.id,
      filename: req.file.originalname, 
      length: req.file.size,       
      contentType: req.file.mimetype 
    };
    res.status(200).json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  });
});

router.post('/upload/avatar', upload.single('avatar'), (req, res) => {
  const bucket = new GridFSBucket(db);
  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.end(req.file.buffer);
  uploadStream.on('finish', () => {
    const fileInfo = {
      _id: uploadStream.id,
      filename: req.file.originalname, 
      length: req.file.size,       
      contentType: req.file.mimetype 
    };
    
    res.status(200).json({
      message: 'File uploaded successfully',
      file: fileInfo // Trả về thông tin file
    });
  });
});

// Tải về hình ảnh và video để hiển thị
router.get('/download/:id', (req, res) => {
  const bucket = new GridFSBucket(db);
  const fileId = new mongoose.Types.ObjectId(req.params.id);
  const downloadStream = bucket.openDownloadStream(fileId);
  downloadStream.pipe(res).on('error', () => {
    res.sendStatus(404);
  });
});

// Lấy danh sách hình ảnh hoặc videos của sản phẩm
router.get('/:productId', async (req, res) => {
  try{
    const { productId } = req.params;
    const bucket = new GridFSBucket(db);
    const files = await bucket.find({ 'metadata.productId': productId }).toArray();
    res.json(files);
  }
    catch (error){
      console.log(error);
    }
  });
export default router;