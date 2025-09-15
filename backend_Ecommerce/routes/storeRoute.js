import express from 'express';
import { Store } from '../models/storeModel.js';

const router = express.Router();

router.get('/taxCode/:taxCode', async (request, response) => {
  try {
    const {taxCode} = request.params;
    const object = await Store.findOne({ taxCode: taxCode });
    if (!object) {
      return response.status(404).json({ message: 'Store not found' });
    }
    response.status(200).json(object);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/:name', async (request, response) => {
  try {
    const {name} = request.params;
    const object = await Store.findOne({ name: name });
    if (!object) {
      return response.status(404).json({ message: 'Store not found' });
    }
    response.status(200).json(object);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
router.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const object = await Store.findOne({ _id: id });
    if (!object) {
      return response.status(404).json({ message: 'Store not found' });
    }
    response.status(200).json(object);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
router.get("/manager/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      
      // Tìm cửa hàng mà user đó là manager
      const store = await Store.find({ manager: userId });

      if (!store) {
          return res.status(404).json({ message: "Không tìm thấy cửa hàng nào mà người này quản lý" });
      }

      res.json(store);
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
router.get('/', async (req, res) => {
    try {
        const stores = await Store.find({})
            .populate('follower', 'name email')
            .populate('manager', 'name email');

        // Gửi kết quả về client
        res.send(stores);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy dữ liệu store', error: error.message });
    }
});
router.post('/', async(req, res) => {
  if(req.body.logo !== ""){
    const newStore = {
      name: req.body.name,
      address: req.body.address,
      taxCode: req.body.taxCode,
      logo: req.body.logo,
      manager: req.body.manager,
      status: 'Active'
    }
    const object = await Store.create(newStore);
    return res.status(201).send(object);
  }
  else{
    const newStore = {
      name: req.body.name,
      address: req.body.address,
      taxCode: req.body.taxCode,
      manager: req.body.manager,
      status: 'Active'
    }
    const object = await Store.create(newStore);
    return res.status(201).send(object);
  }
});
router.put('/:id', async (req, res) => {
    try {
        const updatedObject = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedObject) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(updatedObject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedObject = await Store.findByIdAndDelete(req.params.id);
        if (!deletedObject) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export default router;