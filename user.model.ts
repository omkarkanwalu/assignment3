import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as path from "path";

export interface User {
  name: string;
  email: string;
  password: string;
  generateAuthToken: () => string;
  validatePassword(password: string): boolean;
  generateRefreshToken: () => string;
}
const envPath = path.resolve(__dirname, "config.env");
console.log(` THIS IS  ${envPath}`);

dotenv.config({ path: envPath });

const payload = {};
const secretOrPrivateKey: string | undefined = process.env.JWT_SECRET;

if (secretOrPrivateKey === undefined) {
  // Handle the case where the secretOrPrivateKey is undefined
  console.error("JWT secret key is not defined.");
} else {
  // Sign the JWT if the secretOrPrivateKey is defined
  const token = jwt.sign(payload, secretOrPrivateKey);

  // Use the token as needed
  console.log("Generated JWT:", token);
}

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign(
    { _id: this._id },
    "my-name-is-bucket-flowsea-secret-and-qwertyuijhgfds"
  );

  return token;
};
// asdfghjkoijhgfdszxdfghjnkbhgfgxc

export default mongoose.model<User>("User", userSchema);
