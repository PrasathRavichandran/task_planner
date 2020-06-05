const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");

const app = express();
const port = 4000;

const { List, Task, User } = require("./models");
const { mongoose } = require("./db/dbconfig");

/**
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**
 * Application Routes
 */
/** LISTS */
/** GET- /lists */
app.get("/lists", (req, res) => {
  List.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      console.log(e);
    });
});

/** GET SINGLE LIST - /list/:listId */
app.get("/list/:listId", (req, res) => {
  const listId = req.params.listId;
  List.findById({ _id: listId })
    .then((data) => {
      res.send(data);
    })
    .catch((e) => console.log(e));
});

/** POST LIST - /list */
app.post("/list", (req, res) => {
  const newList = new List({ title: req.body.title });
  newList
    .save()
    .then((finish) => {
      res.send(finish);
    })
    .catch((e) => console.log(e));
});

/** PATCH LIST - /list/:listId */
app.patch("/list/:listId", (req, res) => {
  List.findByIdAndUpdate({ _id: req.params.listId }, { $set: req.body })
    .then((updated) => res.sendStatus(200))
    .catch((e) => console.log(e));
});

/** DELETE LIST - /list/:listId */
app.delete("/list/:listId", (req, res) => {
  List.findByIdAndDelete({ _id: req.params.listId })
    .then((removedList) => res.send(removedList))
    .catch((e) => console.log(e));
});

/**************************************************************** */

/** TASKS */
/** GET- /lists/:listId/tasks */
app.get("/lists/:listId/tasks", (req, res) => {
  Task.find({ _listId: req.params.listId })
    .then((data) => res.send(data))
    .catch((e) => console.log(e));
});

/** GET SINGLE TASK - /lists/:listId/task/:taskId */
app.get("/lists/:listId/task/:taskId", (req, res) => {
  Task.findOne({ _id: req.params.taskId, _listId: req.params.listId })
    .then((data) => res.send(data))
    .catch((e) => console.log(e));
});

/** POST TASK - /lists/:listId/task */
app.post("/lists/:listId/task", (req, res) => {
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
});

/** PATCH TASK - /lists/:listId/task/:taskId */
app.patch("/lists/:listId/task/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    { _id: req.params.taskId, _listId: req.params.listId },
    { $set: req.body }
  )
    .then((updated) => res.sendStatus(200))
    .catch((e) => console.log(e));
});

/** DELETE TASK - /lists/:listId/task/:taskId */
app.delete("/lists/:listId/task/:taskId", (req, res) => {
  Task.findOneAndDelete({ _id: req.params.taskId, _listId: req.params.listId })
    .then((removedTask) => res.send(removedTask))
    .catch((e) => console.log(e));
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

/**
 * Server connection
 */
app.listen(port, () => {
  console.log(chalk.green.inverse(`App is listening to the port ${port}`));
});
