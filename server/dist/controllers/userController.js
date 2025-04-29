"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserRole = exports.getCurrentUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Review_1 = __importDefault(require("../models/Review"));
// Get all users with review counts
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view all users' });
        }
        const pipeline = [
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    reviewCount: { $size: '$reviews' },
                },
            },
            {
                $project: {
                    password: 0,
                    reviews: 0,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ];
        const users = yield User_1.default.aggregate(pipeline);
        res.json(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
// Get current user
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = yield User_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get review count
        const reviewCount = yield Review_1.default.countDocuments({ userId });
        res.json(Object.assign(Object.assign({}, user.toObject()), { reviewCount }));
    }
    catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.getCurrentUser = getCurrentUser;
// Update user role
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update user roles' });
        }
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
        }
        const user = yield User_1.default.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.updateUserRole = updateUserRole;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete users' });
        }
        const { id } = req.params;
        // Don't allow deleting yourself
        if (id === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        const user = yield User_1.default.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Delete all reviews by this user
        yield Review_1.default.deleteMany({ userId: id });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = deleteUser;
