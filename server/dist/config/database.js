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
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const maxRetries = 5;
    const retryDelay = 5000; // 5 seconds
    let retryCount = 0;
    const tryConnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Always use the container name in Docker environment
            const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/movie-reviews';
            console.log('Attempting to connect to MongoDB at:', mongoURI);
            console.log('Environment:', process.env.DOCKER_ENV ? 'Docker' : 'Local');
            console.log('Attempt:', retryCount + 1, 'of', maxRetries);
            // Configure mongoose with better options
            mongoose_1.default.set('strictQuery', false);
            mongoose_1.default.set('bufferCommands', true);
            yield mongoose_1.default.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4, // Force IPv4
                maxPoolSize: 10,
                minPoolSize: 5,
                retryWrites: true,
                w: 'majority'
            });
            console.log('MongoDB connected successfully');
            // Test database operations
            const collections = yield mongoose_1.default.connection.db.listCollections().toArray();
            console.log('Available collections:', collections.map(c => c.name));
            // Set up event handlers
            mongoose_1.default.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('MongoDB reconnected');
            });
            return true;
        }
        catch (error) {
            console.error('MongoDB connection error details:', {
                message: error.message,
                code: error.code,
                name: error.name,
                attempt: retryCount + 1,
                stack: error.stack
            });
            return false;
        }
    });
    while (retryCount < maxRetries) {
        if (yield tryConnect()) {
            return;
        }
        retryCount++;
        if (retryCount < maxRetries) {
            console.log(`Retrying in ${retryDelay / 1000} seconds...`);
            yield new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    console.error('Failed to connect to MongoDB after', maxRetries, 'attempts');
    process.exit(1);
});
exports.default = connectDB;
