"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const statsController_1 = require("../controllers/statsController");
const router = express_1.default.Router();
// Helper function to properly type middleware with AuthRequest
const typedProtect = auth_1.protect;
// Get overall statistics
router.get('/stats', typedProtect, statsController_1.getStats);
// Get user statistics
router.get('/stats/user/:userId', typedProtect, statsController_1.getUserStats);
exports.default = router;
