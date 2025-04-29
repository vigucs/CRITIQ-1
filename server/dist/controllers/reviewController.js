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
const Movie_1 = __importDefault(require("../models/Movie"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Received review creation request:', req.body);
        const { movieId, movieTitle, reviewText, rating, sentiment } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            console.error('No user ID found in the request');
            return res.status(401).json({ message: 'User ID is required' });
        }
        if (!movieId || !movieTitle || !reviewText || !rating || !sentiment) {
            console.error('Missing required fields:', { movieId, movieTitle, reviewText, rating, sentiment });
            return res.status(400).json({ message: 'All fields are required: movieId, movieTitle, reviewText, rating, sentiment' });
        }
        // Check if movie exists
        const movie = yield Movie_1.default.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Check if user already reviewed this movie
        const existingReview = yield Review_1.default.findOne({ userId, movieId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this movie' });
        }
        const reviewData = {
            movieId,
            movieTitle,
            reviewText,
            rating,
            sentiment,
            userId,
        };
        console.log('Creating review with data:', reviewData);
        const review = yield Review_1.default.create(reviewData);
        console.log('Review created successfully:', review);
        res.status(201).json(review);
    }
    catch (error) {
        console.error('Error creating review:', error);
        // Detailed error logging
        if (error.name === 'ValidationError') {
            console.error('Validation error:', error.errors);
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        if (error.name === 'MongoServerError' && error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
            return res.status(409).json({ message: 'Duplicate key error', field: Object.keys(error.keyValue)[0] });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.createReview = createReview;
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { movieId } = req.query;
        let query = {};
        // If user is logged in and no movieId is provided, get user's reviews
        if (userId && !movieId) {
            query.userId = userId;
        }
        // If movieId is provided, get reviews for that movie
        else if (movieId) {
            query.movieId = movieId;
        }
        // Otherwise, return all reviews (with optional pagination)
        // Add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const reviews = yield Review_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name');
        // Get total count for pagination
        const total = yield Review_1.default.countDocuments(query);
        res.json({
            reviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
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
        const review = yield Review_1.default.findOne(Object.assign({ _id: id }, (userId ? { userId } : {}) // Only filter by userId if it exists
        )).populate('userId', 'name');
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
        const { movieTitle, reviewText, rating, sentiment } = req.body;
        const review = yield Review_1.default.findOneAndUpdate({ _id: id, userId }, { movieTitle, reviewText, rating, sentiment }, { new: true, runValidators: true }).populate('userId', 'name');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
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
        // Admins can delete any review, users can only delete their own
        const query = isAdmin ? { _id: id } : { _id: id, userId };
        const review = yield Review_1.default.findOneAndDelete(query);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteReview = deleteReview;
