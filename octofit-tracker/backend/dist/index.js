"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
const start = async () => {
    try {
        await mongoose_1.default.connect(mongoUri);
        console.log(`Connected to MongoDB at ${mongoUri}`);
        app.listen(port, () => {
            console.log(`Backend API running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start backend service', error);
        process.exit(1);
    }
};
void start();
//# sourceMappingURL=index.js.map