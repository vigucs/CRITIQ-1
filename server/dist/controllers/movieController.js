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
exports.searchMovies = exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getMovie = exports.getAllMovies = void 0;
const Movie_1 = __importDefault(require("../models/Movie"));
const Review_1 = __importDefault(require("../models/Review"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all movies with average ratings and review counts
const getAllMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    reviewCount: { $size: '$reviews' },
                    avgRating: { $avg: '$reviews.rating' },
                },
            },
            {
                $project: {
                    reviews: 0, // Don't include the full reviews in response
                },
            },
            {
                $sort: { title: 1 },
            },
        ];
        const movies = yield Movie_1.default.aggregate(pipeline);
        res.json(movies);
    }
    catch (error) {
        console.error('Error getting movies:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.getAllMovies = getAllMovies;
// Get a single movie with its reviews
const getMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid movie ID' });
        }
        const movieId = new mongoose_1.default.Types.ObjectId(id);
        const pipeline = [
            {
                $match: { _id: movieId },
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'reviews',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviews.userId',
                    foreignField: '_id',
                    as: 'users',
                },
            },
            {
                $addFields: {
                    reviewCount: { $size: '$reviews' },
                    avgRating: { $avg: '$reviews.rating' },
                    // Add user names to each review
                    reviews: {
                        $map: {
                            input: '$reviews',
                            as: 'review',
                            in: {
                                _id: '$$review._id',
                                reviewText: '$$review.reviewText',
                                rating: '$$review.rating',
                                sentiment: '$$review.sentiment',
                                userId: '$$review.userId',
                                createdAt: '$$review.createdAt',
                                updatedAt: '$$review.updatedAt',
                                userName: {
                                    $let: {
                                        vars: {
                                            user: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: '$users',
                                                            cond: { $eq: ['$$this._id', '$$review.userId'] },
                                                        },
                                                    },
                                                    0,
                                                ],
                                            },
                                        },
                                        in: '$$user.name',
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    users: 0, // Don't include full user details
                },
            },
        ];
        const [movie] = yield Movie_1.default.aggregate(pipeline);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    }
    catch (error) {
        console.error('Error getting movie:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.getMovie = getMovie;
// Create a new movie
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to create movies' });
        }
        const { title, year, genre, imageUrl, description } = req.body;
        // Check if movie already exists
        const existingMovie = yield Movie_1.default.findOne({ title });
        if (existingMovie) {
            return res.status(400).json({ message: 'Movie with this title already exists' });
        }
        const movie = yield Movie_1.default.create({
            title,
            year,
            genre,
            imageUrl,
            description,
        });
        res.status(201).json(movie);
    }
    catch (error) {
        console.error('Error creating movie:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.createMovie = createMovie;
// Update a movie
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update movies' });
        }
        const { id } = req.params;
        const { title, year, genre, imageUrl, description } = req.body;
        const movie = yield Movie_1.default.findByIdAndUpdate(id, { title, year, genre, imageUrl, description }, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movie);
    }
    catch (error) {
        console.error('Error updating movie:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        res.status(500).json({ message: error.message });
    }
});
exports.updateMovie = updateMovie;
// Delete a movie
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Check if user is admin
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete movies' });
        }
        const { id } = req.params;
        // Delete movie and all associated reviews
        const movie = yield Movie_1.default.findByIdAndDelete(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Delete all reviews for this movie
        yield Review_1.default.deleteMany({ movieId: id });
        res.json({ message: 'Movie deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.deleteMovie = deleteMovie;
// Search movies
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const movies = yield Movie_1.default.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(10);
        res.json(movies);
    }
    catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.searchMovies = searchMovies;
