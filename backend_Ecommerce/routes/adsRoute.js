import express from 'express';
import { Ads } from '../models/adsModel.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post("/", async (req, res) => {
    const newAds = new Ads(req.body);
    await newAds.save();

    req.io.emit("adsAdded", newAds);

    res.status(201).json(newAds);
})

router.put('/:id', async (req, res) => {
    try {
        const updatedAds = await Ads.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAds) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.io.emit("adsUpdated", updatedAds);
        res.json(updatedAds);

        res.json({ message: 'Ads updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedAds = await Ads.findByIdAndDelete(req.params.id);
        if (!deletedAds) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.io.emit("adsDeleted", { AdsId: req.params.id });

        res.json({ message: 'Ads deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;