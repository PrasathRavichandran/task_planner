const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const jwtsecret = "12312312sadsf";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
  },
  session: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

/** [Instance methods] **/
userSchema.methods.toJSON = function () {
  const user = this; // Not access to the global window object, 'this' only access to current object

  const userObject = user.toObject();

  return _.omit(userObject, ["password", "session"]);
};

/** Generating Access token **/
userSchema.methods.generateAccessToken = function () {
  const user = this;
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: user._id.toHexString() },
      jwtsecret,
      { expiresIn: "15m" },
      (err, token) => {
        if (!err) resolve(token);
        else reject();
      }
    );
  });
};

/** Generate Refresh token **/
userSchema.methods.generateRefreshToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, (err, buf) => {
      if (!err) {
        let token = buf.toString("hex");
        return resolve(token);
      }
    });
  });
};

/** create session **/
userSchema.methods.createSession = function () {
  let user = this;
  return user
    .generateRefreshToken()
    .then((refreshToken) => {
      return saveSessionToDatabase(user, refreshToken);
    })
    .then((refreshToken) => {
      return refreshToken;
    })
    .catch((e) => {
      return new Promise.reject("Failed to refresh token to the database!", e);
    });
};

/** [Model methods] - (statics methods) **/
userSchema.statics.findByIdandToken = function (_id, token) {
  const User = this;
  return User.findOne({ _id, "session.token": token });
};

userSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
    if (!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) resolve(user);
        else {
          reject();
        }
      });
    });
  });
};

userSchema.statics.hasRefreshTokenExpires = (expiresAt) => {
  let secondsForNow = Date.now() / 1000; /// will gives today date by seconds
  if (expiresAt > secondsForNow) {
    // hasn't expires
    return false;
  } else {
    return true;
  }
};

/** Middleware **/
/** Hash the password, before storing to the database **/
userSchema.pre("save", function (next) {
  if (user.isModified("password")) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (!err) user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/** [Helper methods] **/
/** Save session to database **/
let saveSessionToDatabase = (user, refreshToken) => {
  return new Promise((resolve, reject) => {
    let expiresAt = generateExpiresAttime();
    user.session.push({ token: refreshToken, expiresAt });
    user
      .save()
      .then(() => {
        return resolve(refreshToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

/** Generate expires at time **/
let generateExpiresAttime = function () {
  let dateUntilExpires = "10";
  let secondUntilExpires = ((dateUntilExpires * 24) * 60) * 60;
  return ((Date.now() / 1000) + secondUntilExpires);
};

const User = mongoose.model("users", userSchema);

module.exports = { User };
