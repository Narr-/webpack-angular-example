'use strict';

var logger = require('../util/logger')(module);
var mongoose = require('mongoose');
var config = require('../config');
var promise = new Promise(function(resolve, reject) {
  mongoose.connect(config.MONGO_URI, function(err) {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});
var router = require('express').Router();
var timeout = require('connect-timeout');
var TodoModel = require('../model/todo');
var io = require('../socket')();
var uuid = require('node-uuid');

router.use(timeout('5s'));

router.post('/', function(req, res) {
  var userId;

  logger.debug('session: ', req.session);

  if (req.body.userId) {
    userId = true;
    if (req.session) {
      req.session.userId = req.body.userId;
    }
  } else if (req.session && req.session.userId) {
    userId = req.session.userId;
  }

  promise.then(function(result) {
    if (userId) {
      if (userId === true) {
        res.json({
          message: 'hooray! welcome to our api!'
        });
      } else {
        res.json({
          userId: userId,
          message: 'hooray! welcome to our api!'
        });
      }
    } else {
      TodoModel.findOne({
        userIp: req.ip
      }, function(err, doc) {
        if (err) {
          logger.error(err);
          res.status(500).json({
            message: 'Error fetching userId'
          });
        } else {
          if (doc === null) {
            userId = uuid.v1();
            if (req.session) {
              req.session.userId = userId;
            }
            res.json({
              userId: userId,
              message: 'hooray! welcome to our api! New User Id'
            });
          } else {
            // logger.debug(doc.toString());
            userId = doc.userId;
            if (req.session) {
              req.session.userId = userId;
            }
            res.json({
              userId: userId,
              message: 'hooray! welcome to our api! retrieved userId'
            });
          }
        }
      });
    }
  }, function(err) {
    logger.error(err.name, err);
    res.status(503).json({
      message: 'DB connection Error..!!'
    });
  });
});
router.route('/todos')
  .get(function(req, res, next) {
    TodoModel.find({
      userId: req.session.userId
    }, function(err, docs) { // Mongo command to fetch all docs from collection.
      if (err) {
        logger.error(err);
        // res.send(err);
        res.status(500).json({
          message: 'Error fetching data'
        });
      } else {
        // logger.debug(docs.toString());
        res.json(docs);
      }
    });
  })
  .post(function(req, res) {
    var todoModel = new TodoModel();
    todoModel.userId = req.session.userId;
    todoModel.userIp = req.ip;
    todoModel.title = req.body.title;
    var completed = req.body.completed;
    if (completed === true || completed === false || completed === 'true' || completed === 'false') {
      todoModel.completed = completed;
    }
    todoModel.save(function(err, doc) {
      if (err) {
        logger.error(err);
        res.status(500).json({
          message: 'Error adding data'
        });
      } else {
        res.json({
          _id: doc._id,
          message: 'Data added'
        });
        // emit msg to the room this socket joined to except this socket
        io.sockets.connected[req.body.socketId].to(req.session.userId).emit('dbChange', {
          message: 'Data added'
        });
      }
    });
  })
  .delete(function(req, res) {
    TodoModel.remove({
      completed: true
    }, function(err, removed) {
      if (err) {
        logger.error(err);
        res.status(500).json({
          message: 'Error deleting data'
        });
      } else {
        res.json({
          n: removed.result.n,
          message: 'Data deleted'
        });
      }
    });
  });

router.route('/todos/:id')
  .put(function(req, res) {
    TodoModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      completed: req.body.completed
    }, function(err, doc) {
      if (err) {
        logger.error(err);
        res.status(500).json({
          message: 'Error updating data'
        });
      } else {
        res.json({
          _id: doc._id,
          message: 'Data updated'
        });
        io.sockets.connected[req.body.socketId].to(req.session.userId).emit('dbChange', {
          message: 'Data updated'
        });
      }
    });
  })
  .delete(function(req, res) {
    TodoModel.findByIdAndRemove(req.params.id, function(err, doc) {
      if (err) {
        logger.error(err);
        res.status(500).json({
          message: 'Error deleting data'
        });
      } else {
        res.json({
          _id: doc._id,
          message: 'Data deleted'
        });
      }
    });
  });

router.use('/', function(err, req, res, next) {
  logger.error(err);
  next(err); // throw err
});

module.exports = router;
