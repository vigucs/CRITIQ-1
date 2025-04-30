"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const movieController_1 = require("../controllers/movieController");
const router = express_1.default.Router();
// Helper function to convert middleware to the correct type
const typedProtect = auth_1.protect;
// Public routes - using type assertions to work around TypeScript errors
router.get('/', movieController_1.getAllMovies);
router.get('/tmdb/:id', movieController_1.getMovie);
router.get('/search', movieController_1.searchMovies);
router.get('/:id', movieController_1.getMovie);
// Protected routes (admin only)
router.post('/', typedProtect, movieController_1.createMovie);
router.put('/:id', typedProtect, movieController_1.updateMovie);
router.delete('/:id', typedProtect, movieController_1.deleteMovie);
exports.default = router;
