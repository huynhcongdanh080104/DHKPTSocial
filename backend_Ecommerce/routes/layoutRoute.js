import express from 'express';
import { Layout } from '../models/layoutModel.js';
import mongoose from 'mongoose';
const router = express.Router();

router.get("/store/:storeId", async (req, res) => {
    try {
        const { storeId } = req.params;

        // Kiểm tra xem storeId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ message: "Invalid store ID" });
        }

        const layouts = await Layout.find()
            .populate('adsLayout');

        const filteredLayouts = layouts
            .filter(layout => layout.store.equals(storeId))
            .sort((a, b) => a.index - b.index);

        res.json(filteredLayouts);
    } catch (error) {
        console.error("Error fetching layouts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/name/:layoutName/:storeID", async (req, res) => {
    try {
        const { layoutName, storeID } = req.params;
        const layout = await Layout.findOne({ store: storeID, name: layoutName });

        if (layout) {
            return res.status(200).json({ data: layout, message: "Tồn tại bố cục" });
        }

        return res.status(404).json({ message: "Chưa tồn tại bố cục đó" });
    } catch (error) {
        console.error("Error fetching layout:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const newLayout = new Layout(req.body);
    await newLayout.save();

    req.io.emit("layoutAdded", newLayout);

    res.status(201).json(newLayout);
})
router.post("/newStore/:storeID", async (req, res) => {
    const {storeID} = req.params;
    const newestlist = {
        name: "newestlist",
        layoutType: "list",
        index: 1,
        store: storeID
    }
    const topSellinglist = {
        name: "topSellinglist",
        layoutType: "list",
        index: 2,
        store: storeID
    }
    const topRatedlist = {
        name: "topRatedlist",
        layoutType: "list",
        index: 3,
        store: storeID
    }
    const onSalelist = {
        name: "onSalelist",
        layoutType: "list",
        index: 4,
        store: storeID
    }
    const listAll = {
        name: "listAll",
        layoutType: "list",
        index: 5,
        store: storeID
    }
    const newLayout = new Layout(newestlist);
    await newLayout.save();

    const newLayout2 = new Layout(topSellinglist);
    await newLayout2.save();

    const newLayout3 = new Layout(topRatedlist);
    await newLayout3.save();

    const newLayout4 = new Layout(onSalelist);
    await newLayout4.save();

    const newLayout5 = new Layout(listAll);
    await newLayout5.save();
    res.status(201).json({ message: 'Thêm layout thành công' });
})

router.put('/:id', async (req, res) => {
    try {
        const updatedLayout = await Layout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLayout) {
            return res.status(404).json({ message: 'Layout not found' });
        }
        req.io.emit("layoutUpdated", updatedLayout);
        res.json(updatedLayout);

        res.json({ message: 'Layout updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedLayout = await Layout.findByIdAndDelete(req.params.id);
        if (!deletedLayout) {
            return res.status(404).json({ message: 'Layout not found' });
        }
        req.io.emit("layoutDeleted", { layoutId: req.params.id });

        res.json({ message: 'Layout deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;