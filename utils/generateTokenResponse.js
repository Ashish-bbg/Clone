import jwt from "jsonwebtoken";

export const generateTokenResponse = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
};
