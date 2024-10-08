const User = require("../models/user");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createJwtToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "20d" });
const createSendToken = (user, status, res) => {
  try {
    const token = createJwtToken(user._id);
    if (!token) {
      res.status(404).json({ message: "error in token" });
    }
    const cookieOption = {
      httpOnly: true,
      sameSite: "None", // Helps protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // Cookie will expire in 1 day
    };
    if (process.env.NODE_ENV === "production") {
      cookieOption.secure = true;
    }

    res.cookie("jwt", token, cookieOption);
    res.status(status).json({
      status: "success",
      message: "singed up successfully",
      token,
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "fail to signin" });
  }
};
exports.signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, username, email, password } = req.body;
    let x = await User.findOne({ email });
    console.log(x);
    if (x) {
      next(new AppError("email is already registered", 404));
    }
    if (await User.findOne({ username })) {
      next(new AppError("username is already taken, try another one", 404));
    }
    const newUser = await User.create({ name, username, email, password });
    console.log(newUser);

    createSendToken(newUser, 200, res);
  } catch (error) {
    console.log(error);

    return next(new AppError("error in credintials", 404));
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername) {
      next(new AppError("please provide email or username"));
    }
    const user =
      (await User.findOne({ email: emailOrUsername })) ||
      (await User.findOne({ username: emailOrUsername }));
    if (!user || !(await user.correctPassword(password, user.password))) {
      next(new AppError("incorrect credintials", 404));
    }
    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);

    next(new AppError("incorrect credintials", 404));
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      next(new AppError("you are not logged in", 404));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      next(
        new AppError(
          "the user belonging to this account is no longer exists",
          404
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {}
};
