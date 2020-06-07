const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");

const app = express();
const port = 4000;

const { List, Task, User } = require("./models");
const { mongoose } = require("./db/dbconfig");

/**
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** checking the valid JWT token **/
let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");
  jwt.verify(token, User.JWTSecretKey(), (err, decoded) => {
    if (err) {
      res.status(401).send(err);
    } else {
      req.user_id = decoded._id;
      next();
    }
  });
};

/** Verify the Auth token */
let verifyAuthtoken = (req, res, next) => {
  let refreshToken = req.header("x-refresh-token");
  let _id = req.header("_id");
  User.findByIdandToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }
      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.session.forEach((session) => {
        if (session.token === refreshToken) {
          if (User.hasRefreshTokenExpires(session.expiresAt) === false) {
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        next();
      } else {
        return Promise.reject({
          error: "Refresh token has expired",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

/**
 * CORS policy
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,x-access-token,x-refresh-token,_id"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  next();
});

/**
 * Application Routes
 */
/** LISTS */
/** GET- /lists */
app.get("/lists", authenticate, (req, res) => {
  List.find({
    _userId: req.user_id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

/** GET SINGLE LIST - /list/:listId */
app.get("/list/:listId", authenticate, (req, res) => {
  const listId = req.params.listId;
  List.findById({ _id: listId })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => console.log(e));
});

/** POST LIST - /list */
app.post("/list", authenticate, (req, res) => {
  const newList = new List({ title: req.body.title, _userId: req.user_id });
  newList
    .save()
    .then((finish) => {
      res.send(finish);
    })
    .catch((e) => console.log(e));
});

/** PATCH LIST - /list/:listId */
app.patch("/list/:listId", authenticate, (req, res) => {
  List.findByIdAndUpdate(
    { _id: req.params.listId, _userId: req.user_id },
    { $set: req.body }
  )
    .then((updated) => res.sendStatus(200))
    .catch((e) => console.log(e));
});

/** DELETE LIST - /list/:listId */
app.delete("/list/:listId", authenticate, (req, res) => {
  List.findByIdAndDelete({ _id: req.params.listId, _userId: req.user_id })
    .then((removedList) => {
      res.send(removedList);
      // delete its corresponding task also.
      deleteTaskForTheList(removedList._id);
    })
    .catch((e) => console.log(e));
});

/**************************************************************** */

/** TASKS */
/** GET- /lists/:listId/tasks */
app.get("/lists/:listId/tasks", authenticate, (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((data) => res.send(data))
    .catch((e) => console.log(e));
});

/** GET SINGLE TASK - /lists/:listId/task/:taskId */
app.get("/lists/:listId/task/:taskId", authenticate, (req, res) => {
  Task.findOne({ _id: req.params.taskId, _listId: req.params.listId })
    .then((data) => res.send(data))
    .catch((e) => console.log(e));
});

/** POST TASK - /lists/:listId/task */
app.post("/lists/:listId/task", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      } else {
        return false;
      }
    })
    .then((canCreateTask) => {
      if (canCreateTask) {
        const newTask = new Task({
          title: req.body.title,
          _listId: req.params.listId,
        });
        newTask
          .save()
          .then((finished) => {
            res.send(finished);
          })
          .catch((e) => console.log(e));
      } else {
        res.sendStatus(404);
      }
    });
});

/** PATCH TASK - /lists/:listId/task/:taskId */
app.patch("/lists/:listId/task/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      } else {
        return false;
      }
    })
    .then((canUpdateTask) => {
      if (canUpdateTask) {
        Task.findOneAndUpdate(
          { _id: req.params.taskId, _listId: req.params.listId },
          { $set: req.body }
        )
          .then((updated) => res.sendStatus(200))
          .catch((e) => console.log(e));
      } else {
        res.sendStatus(404);
      }
    });
});

/** DELETE TASK - /lists/:listId/task/:taskId */
app.delete("/lists/:listId/task/:taskId", authenticate, (req, res) => {
  List.findOne({
    _id: req.params.listId,
    _userId: req.user_id,
  })
    .then((list) => {
      if (list) {
        return true;
      } else {
        return false;
      }
    })
    .then((canDeleteTask) => {
      if (canDeleteTask) {
        Task.findOneAndDelete({
          _id: req.params.taskId,
          _listId: req.params.listId,
        })
          .then((removedTask) => res.send(removedTask))
          .catch((e) => console.log(e));
      } else {
        res.sendStatus(404);
      }
    });
});

/***************************************************************** */

/** USER AUTHENTICATION */
/** SIGN UP NEW USER - /user */
app.post("/user", (req, res) => {
  const newUser = new User(req.body);
  newUser.save().then((userResponse) => {
    // create a session by sending refreshToken
    return newUser
      .createSession()
      .then((refreshToken) => {
        return newUser.generateAccessToken().then((accessToken) => {
          return { accessToken, refreshToken };
        });
      })
      .then((authTokens) => {
        res
          .header("x-access-token", authTokens.accessToken)
          .header("x-refresh-token", authTokens.refreshToken)
          .send(userResponse);
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  });
});

/** SIGN IN USER - /user/login */
app.post("/user/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findByCredentials(email, password)
    .then((user) => {
      // create a session by sending refreshToken
      return user
        .createSession()
        .then((refreshToken) => {
          return user.generateAccessToken().then((accessToken) => {
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          res
            .header("x-access-token", authTokens.accessToken)
            .header("x-refresh-token", authTokens.refreshToken)
            .send(user);
        })
        .catch((e) => {
          res.status(400).send(e);
        });
    })
    .catch((e) => {
      res.status(401).send(e);
    });
});

/** generate and return access token **/
app.get("/user/me/access-token", verifyAuthtoken, (req, res) => {
  req.userObject
    .generateAccessToken()
    .then((accessToken) => {
      res.header("x-access-token", accessToken).send({ accessToken });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

/** Helper methods */
let deleteTaskForTheList = (listId) => {
  Task.deleteMany({
    _listId: listId,
  }).then((res) => {
    console.log("Task deleted successfully");
  });
};

/**
 * Server connection
 */
app.listen(port, () => {
  console.log(chalk.green.inverse(`App is listening to the port ${port}`));
});
