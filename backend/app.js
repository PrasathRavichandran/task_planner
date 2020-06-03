const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");

const app = express();
const port = 4000;

const { List, Task } = require("./models");
const { mongoose } = require("./db/dbconfig");

/**
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

/**
 * Server connection
 */
app.listen(port, () => {
  console.log(chalk.green.inverse(`App is listening to the port ${port}`));
});
