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
exports.deleteReview = exports.updateReview = exports.getReview = exports.getReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5500';
// Helper function to recalculate movie ratings
const recalculateMovieRating = (movieId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Review_1.default.aggregate([
            { $match: { movieId } },
            {
                $group: {
                    _id: '$movieId',
                    averageRating: { $avg: '$rating' },
                    ratingCount: { $sum: 1 },
                    sentimentStats: {
                        $push: {
                            sentiment: '$sentiment',
                            count: 1
                        }
                    }
                }
            }
        ]);
        if (result.length === 0) {
            return {
                averageRating: '0.0',
                ratingCount: 0,
                sentimentPercentages: {
                    positive: 0,
                    negative: 0,
                    neutral: 0
                }
            };
        }
        const averageRating = result[0].averageRating || 0;
        const ratingCount = result[0].ratingCount || 0;
        // Calculate sentiment percentages
        const sentimentStats = result[0].sentimentStats || [];
        const sentimentCounts = sentimentStats.reduce((acc, stat) => {
            acc[stat.sentiment] = (acc[stat.sentiment] || 0) + stat.count;
            return acc;
        }, { positive: 0, negative: 0, neutral: 0 });
        const totalSentiments = Object.values(sentimentCounts).reduce((sum, count) => sum + count, 0);
        const sentimentPercentages = Object.entries(sentimentCounts).reduce((acc, [sentiment, count]) => {
            const numCount = count;
            acc[sentiment] = totalSentiments > 0 ? Math.round((numCount / totalSentiments) * 100) : 0;
            return acc;
        }, { positive: 0, negative: 0, neutral: 0 });
        return {
            averageRating: averageRating.toFixed(1),
            ratingCount,
            sentimentPercentages
        };
    }
    catch (error) {
        console.error('Error recalculating movie rating:', error);
        throw error;
    }
});
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { movieId, reviewText } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Call ML API for sentiment analysis
        const mlResponse = yield axios_1.default.post(`${process.env.ML_API_URL}/predict`, {
            text: reviewText
        });
        const { sentiment, sentiment_score, rating: mlRating } = mlResponse.data;
        // Create review with sentiment analysis
        const review = yield Review_1.default.create({
            movieId,
            userId,
            reviewText,
            rating: mlRating, // Use ML-generated rating
            sentiment,
            sentimentScore: sentiment_score
        });
        // Recalculate movie rating
        yield recalculateMovieRating(movieId);
        res.status(201).json(review);
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review' });
    }
});
exports.createReview = createReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Support userId from query params or from logged-in user
        const userIdFromQuery = req.query.userId;
        const userId = userIdFromQuery || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        const { movieId, page = 1, limit = 10, sort = 'newest' } = req.query;
        let query = {};
        let filterByUser = false;
        if (userId && !movieId) {
            // Flexible match: allow both string and ObjectId
            query.userId = { $in: [userId, new mongoose_1.default.Types.ObjectId(userId)] };
            filterByUser = true;
        }
        else if (movieId) {
            query.movieId = movieId;
        }
        // Debug logging
        console.log('getReviews: userId:', userId);
        console.log('getReviews: query:', JSON.stringify(query));
        const skip = (Number(page) - 1) * Number(limit);
        // Determine sort order
        let sortOptions = { createdAt: -1 }; // Default: newest first
        if (sort === 'oldest') {
            sortOptions = { createdAt: 1 };
        }
        else if (sort === 'highest') {
            sortOptions = { rating: -1 };
        }
        else if (sort === 'lowest') {
            sortOptions = { rating: 1 };
        }
        const reviews = yield Review_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .populate('userId', 'name');
        // Debug logging
        console.log('getReviews: reviews found:', reviews.length);
        const total = yield Review_1.default.countDocuments(query);
        // Get movie stats if movieId is provided
        let stats = null;
        if (movieId) {
            stats = yield recalculateMovieRating(movieId);
        }
        // Calculate user-specific average rating if filtering by user
        let userAvgRating = null;
        if (filterByUser) {
            const userReviews = yield Review_1.default.find({ userId: { $in: [userId, new mongoose_1.default.Types.ObjectId(userId)] } });
            if (userReviews.length > 0) {
                userAvgRating = (userReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / userReviews.length).toFixed(1);
            }
        }
        res.json({
            reviews,
            stats,
            userAvgRating,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getReviews = getReviews;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const review = yield Review_1.default.findOne(Object.assign({ _id: id }, (userId ? { userId } : {}))).populate('userId', 'name');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getReview = getReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { movieTitle, reviewText } = req.body;
        const existingReview = yield Review_1.default.findOne({ _id: id, userId });
        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const movieId = existingReview.movieId;
        let updateFields = { movieTitle };
        // If reviewText is being updated, re-run sentiment analysis
        if (reviewText && reviewText !== existingReview.reviewText) {
            const mlResponse = yield axios_1.default.post(`${process.env.ML_API_URL}/predict`, {
                text: reviewText
            });
            const { sentiment, sentiment_score, rating: mlRating } = mlResponse.data;
            updateFields = Object.assign(Object.assign({}, updateFields), { reviewText, rating: mlRating, sentiment, sentimentScore: sentiment_score });
        }
        const review = yield Review_1.default.findOneAndUpdate({ _id: id, userId }, updateFields, { new: true, runValidators: true }).populate('userId', 'name');
        // Recalculate movie rating after updating a review
        const stats = yield recalculateMovieRating(movieId);
        res.json({
            review,
            stats
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const isAdmin = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'admin';
        const existingReview = yield Review_1.default.findOne(Object.assign({ _id: id }, (isAdmin ? {} : { userId })));
        if (!existingReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const movieId = existingReview.movieId;
        const query = isAdmin ? { _id: id } : { _id: id, userId };
        const review = yield Review_1.default.findOneAndDelete(query);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Recalculate movie rating after deleting a review
        const stats = yield recalculateMovieRating(movieId);
        res.json({
            message: 'Review deleted successfully',
            stats
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteReview = deleteReview;
