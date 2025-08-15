import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);
  // console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN}
  );
};
