import express from 'express';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';
const router = express.Router();

// Route để lấy tất cả users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy dữ liệu users', error: error.message });
    }
});

// Route để tạo một user mới
router.post('/', async (req, res) => {
    try {
        const { username, password, name, dob, email, description, avatar } = req.body;

        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send({ message: 'Username hoặc email đã tồn tại' });
        }

        // Tạo user mới
        const newUser = new User({ username, password, name, dob, email, description, avatar });
        await newUser.save();

        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi tạo user', error: error.message });
    }
});

// Route để lấy thông tin một user bằng ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'Không tìm thấy user' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi lấy thông tin user', error: error.message });
    }
});

// Route để cập nhật thông tin một user bằng ID
router.put('/:id', async (req, res) => {
    try {
        const { username, password, name, dob, email, description, avatar, status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, password, name, dob, email, description, avatar, status },
            { new: true } // Trả về user đã được cập nhật
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'Không tìm thấy user' });
        }

        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi cập nhật user', error: error.message });
    }
});

// Route để xóa một user bằng ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send({ message: 'Không tìm thấy user' });
        }
        res.send({ message: 'User đã được xóa thành công' });
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi xóa user', error: error.message });
    }
});

// Route để follow/unfollow một user
router.post('/:id/follow', async (req, res) => {
    try {
        const { userId } = req.body; // ID của người dùng muốn follow/unfollow
        const userToFollow = await User.findById(req.params.id); // User được follow/unfollow

        if (!userToFollow) {
            return res.status(404).send({ message: 'Không tìm thấy user' });
        }

        // Kiểm tra xem userId đã follow userToFollow chưa
        const isFollowing = userToFollow.followers.includes(userId);

        if (isFollowing) {
            // Nếu đã follow, thực hiện unfollow
            userToFollow.followers.pull(userId);
            await User.findByIdAndUpdate(userId, { $pull: { followings: req.params.id } });
        } else {
            // Nếu chưa follow, thực hiện follow
            userToFollow.followers.push(userId);
            await User.findByIdAndUpdate(userId, { $push: { followings: req.params.id } });
        }

        await userToFollow.save();
        res.send({ message: isFollowing ? 'Unfollow thành công' : 'Follow thành công' });
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi thực hiện follow/unfollow', error: error.message });
    }
});
export default router;