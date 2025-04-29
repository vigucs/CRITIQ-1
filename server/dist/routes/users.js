"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Current user route
router.get('/me', auth_1.protect, userController_1.getCurrentUser);
// Admin routes
router.get('/', auth_1.protect, userController_1.getUsers);
router.patch('/:id/role', auth_1.protect, userController_1.updateUserRole);
router.delete('/:id', auth_1.protect, userController_1.deleteUser);
exports.default = router;
