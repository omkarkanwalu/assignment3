"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const envPath = path.resolve(__dirname, "config.env");
console.log(` THIS IS  ${envPath}`);
dotenv.config({ path: envPath });
const app = (0, express_1.default)();
app.use(express_1.default.json());
const databaseUrl = process.env.DATABASE;
databaseUrl ? process.env.DATABASE : process.env.DATABASE;
if (databaseUrl !== undefined) {
    mongoose_1.default.connect("mongodb+srv://omkarkanwalu:T04ZgUimXncAtbub@cluster0.oasaetg.mongodb.net/customers", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    });
}
else {
    console.error("Database URL is undefined");
}
// Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/auth", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.connect(databaseUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
app.get("/hi", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: "qwertyui" });
}));
// Create a route for user signup
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user data from the request body
    const { name, email, password } = req.body;
    // Validate the user data
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    // Check if the user already exists
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    // Create a new user
    const user = new user_model_1.default({ name, email, password });
    yield user.save();
    // Generate a JWT token for the user
    const token = yield user.generateAuthToken();
    // Send the token back to the user
    res.status(201).json({ token });
}));
// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
