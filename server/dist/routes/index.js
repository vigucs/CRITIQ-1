"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const reviewController_1 = require("../controllers/reviewController");
const stats_1 = __importDefault(require("./stats"));
const movies_1 = __importDefault(require("./movies"));
const users_1 = __importDefault(require("./users"));
const router = express_1.default.Router();
// Auth routes
router.post('/auth/register', authController_1.register);
router.post('/auth/login', authController_1.login);
router.post('/auth/google', authController_1.googleLogin);
// Movie routes
router.use('/movies', movies_1.default);
// User routes
router.use('/users', users_1.default);
// Review routes
router.post('/reviews', auth_1.protect, reviewController_1.createReview);
router.get('/reviews', auth_1.protect, reviewController_1.getReviews);
// Stats routes - place before the :id route to avoid conflict
router.use('/reviews', stats_1.default);
// Individual review routes
router.get('/reviews/:id', auth_1.protect, reviewController_1.getReview);
router.put('/reviews/:id', auth_1.protect, reviewController_1.updateReview);
router.delete('/reviews/:id', auth_1.protect, reviewController_1.deleteReview);
exports.default = router;
