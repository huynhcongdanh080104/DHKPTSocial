import { User } from "../models/userModel.js";
import mongoose from "mongoose";

// API lấy danh sách người dùng có thể bạn biết
export const getMayKnowUsers = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!mongoose.isValidObjectId(userId)) {
            console.log("⚠️ [WARNING] Invalid userId");
            return res
                .status(400)
                .json({ success: false, message: "Invalid userId" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        console.log("📥 [INFO] Converted userId:", objectId);

        const user = await User.findById(objectId);
        if (!user) {
            console.log("⚠️ [WARNING] User not found");
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        // Lấy danh sách followings và followers của người dùng
        const followings = (user.followings || []).map(
            (id) => new mongoose.Types.ObjectId(id.toString())
        );
        const followers = (user.followers || []).map(
            (id) => new mongoose.Types.ObjectId(id.toString())
        );

        console.log("🔗 [INFO] Direct followings:", followings);
        console.log("👥 [INFO] Direct followers:", followers);

        // Tạo danh sách excludeIds
        const excludeIds = [objectId, ...followings, ...followers];
        console.log("🗑️ [INFO] Exclude IDs (direct connections):", excludeIds);

        // Lấy danh sách followings của followings (mối quan hệ gián tiếp)
        const indirectFollowings = await User.find({
            _id: { $in: followings },
        }).select("followings name");
        console.log("🔍 [INFO] Fetching followings of followings...");

        // Thu thập followings của followings
        const indirectIds = new Set();
        indirectFollowings.forEach((followingUser) => {
            console.log(
                `🔍 [INFO] Processing followings of ${followingUser.name} (${followingUser._id})`
            );
            (followingUser.followings || []).forEach((id) => {
                if (!excludeIds.includes(id.toString())) {
                    indirectIds.add(id.toString());
                    console.log(`✅ [INFO] Added indirect following ID: ${id}`);
                } else {
                    console.log(
                        `🛑 [INFO] Skipped direct connection ID: ${id}`
                    );
                }
            });
        });

        // Tìm kiếm người dùng dựa trên mối quan hệ gián tiếp
        let mayKnowUsers = await User.find({
            _id: { $in: Array.from(indirectIds) },
        })
            .select("name username avatar")
            .limit(3)
            .lean();

        // Loại bỏ người dùng hiện tại khỏi danh sách kết quả
        mayKnowUsers = mayKnowUsers.filter(
            (user) => !user._id.equals(objectId)
        );
        console.log(
            "✅ [INFO] Filtered May Know Users (excluding current user):",
            mayKnowUsers
        );

        res.json({ success: true, data: mayKnowUsers });
    } catch (error) {
        console.error("❌ [ERROR] Error fetching may-know users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// API tìm kiếm người dùng theo tên
export const searchUsers = async (req, res) => {
    try {
        const { query, userId } = req.query;

        if (!mongoose.isValidObjectId(userId)) {
            console.log("⚠️ [WARNING] Invalid userId");
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        console.log("📥 [INFO] Converted userId:", objectId);
        console.log("🔍 [INFO] Search query:", query);

        // Tìm kiếm tất cả người dùng có tên chứa từ khóa tìm kiếm, ngoại trừ người dùng hiện tại
        const results = await User.find({
            _id: { $ne: objectId },
            name: { $regex: query, $options: "i" },
        })
            .select("name username avatar")
            .limit(10)
            .lean();

        console.log("✅ [INFO] Search results:", results);

        res.json({ success: true, data: results });
    } catch (error) {
        console.error("❌ [ERROR] Error searching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getRandomUsers = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!mongoose.isValidObjectId(userId)) {
            console.log("⚠️ [WARNING] Invalid userId");
            return res.status(400).json({ success: false, message: "Invalid userId" });
        }

        const objectId = new mongoose.Types.ObjectId(userId);
        console.log("📥 [INFO] Converted userId:", objectId);

        const currentUser = await User.findById(objectId);
        if (!currentUser) {
            console.log("⚠️ [WARNING] User not found");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Lấy danh sách followings của người dùng hiện tại
        const followings = (currentUser.followings || []).map(id => new mongoose.Types.ObjectId(id.toString()));

        // Tạo danh sách excludeIds bao gồm người dùng hiện tại và followings
        const excludeIds = [objectId, ...followings];

        // Lấy ngẫu nhiên 3 người dùng, ngoại trừ những người trong excludeIds
        const randomUsers = await User.aggregate([
            { $match: { _id: { $nin: excludeIds } } },
            { $sample: { size: 3 } },
            { $project: { name: 1, username: 1, avatar: 1 } }
        ]);

        console.log("✅ [INFO] Random Users:", randomUsers);

        res.json({ success: true, data: randomUsers });
    } catch (error) {
        console.error("❌ [ERROR] Error fetching random users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};