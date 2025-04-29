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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Review_1 = __importDefault(require("../models/Review"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Get all reviews with pagination and filtering
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const userId = req.query.userId;
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order || 'desc';
        const query = {};
        if (userId) {
            query.userId = userId;
        }
        const skip = (page - 1) * limit;
        const [reviews, total] = yield Promise.all([
            Review_1.default.find(query)
                .sort({ [sortBy]: order })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name')
                .lean(),
            Review_1.default.countDocuments(query)
        ]);
        res.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Get a specific review
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.default.findById(req.params.id)
            .populate('user', 'name')
            .lean();
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Create a new review
router.post('/', auth_1.protect, validation_1.validateReview, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieTitle, reviewText, rating, sentiment } = req.body;
        const review = yield Review_1.default.create({
            movieTitle,
            reviewText,
            rating,
            sentiment,
            userId: req.user.id
        });
        const populatedReview = yield Review_1.default.findById(review._id)
            .populate('user', 'name')
            .lean();
        res.status(201).json(populatedReview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Update a review
router.put('/:id', auth_1.protect, validation_1.validateReview, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.default.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }
        const { movieTitle, reviewText, rating } = req.body;
        const updatedReview = yield Review_1.default.findByIdAndUpdate(req.params.id, { movieTitle, reviewText, rating }, { new: true }).populate('user', 'name').lean();
        res.json(updatedReview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Delete a review
router.delete('/:id', auth_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield Review_1.default.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        yield review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
