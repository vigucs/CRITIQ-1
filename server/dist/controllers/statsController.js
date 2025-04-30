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
exports.getUserStats = exports.getStats = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const User_1 = __importDefault(require("../models/User"));
// Get overall statistics
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [totalReviews, totalUsers, averageRating, sentimentStats, recentReviews, monthlyStats] = yield Promise.all([
            Review_1.default.countDocuments(),
            User_1.default.countDocuments(),
            Review_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' }
                    }
                }
            ]),
            Review_1.default.aggregate([
                {
                    $group: {
                        _id: '$sentiment',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Review_1.default.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name')
                .lean(),
            Review_1.default.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.year': -1, '_id.month': -1 }
                }
            ])
        ]);
        // Handle empty database case
        const stats = {
            totalReviews: totalReviews || 0,
            totalUsers: totalUsers || 0,
            averageRating: averageRating.length > 0 && ((_a = averageRating[0]) === null || _a === void 0 ? void 0 : _a.averageRating)
                ? Number(averageRating[0].averageRating.toFixed(1))
                : 0,
            sentimentBreakdown: sentimentStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, { positive: 0, negative: 0, neutral: 0 }),
            recentReviews: recentReviews || [],
            monthlyStats: monthlyStats || []
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            message: 'Error fetching statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getStats = getStats;
// Get user statistics
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.params.userId;
        const [totalReviews, averageRating, sentimentStats, recentReviews, monthlyStats] = yield Promise.all([
            Review_1.default.countDocuments({ userId }),
            Review_1.default.aggregate([
                {
                    $match: { userId }
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: '$rating' }
                    }
                }
            ]),
            Review_1.default.aggregate([
                {
                    $match: { userId }
                },
                {
                    $group: {
                        _id: '$sentiment',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Review_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name')
                .lean(),
            Review_1.default.aggregate([
                {
                    $match: { userId }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.year': -1, '_id.month': -1 }
                }
            ])
        ]);
        // Handle empty database case
        const stats = {
            totalReviews: totalReviews || 0,
            averageRating: averageRating.length > 0 && ((_a = averageRating[0]) === null || _a === void 0 ? void 0 : _a.averageRating)
                ? Number(averageRating[0].averageRating.toFixed(1))
                : 0,
            sentimentBreakdown: sentimentStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, { positive: 0, negative: 0, neutral: 0 }),
            recentReviews: recentReviews || [],
            monthlyStats: monthlyStats || []
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            message: 'Error fetching user statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
exports.getUserStats = getUserStats;
