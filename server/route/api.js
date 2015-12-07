'use strict';

var logger = require('../util/logger')(module);
var mongoose = require('mongoose');
var config = require('../config');
var promise = new Promise(function(resolve, reject) {
  mongoose.connect(config.DB, function(err) {
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

router.use(timeout('5s'));
router.get('/', function(req, res) {
  promise.then(function(result) {
    res.json({
      message: 'hooray! welcome to our api!'
    });
  }, function(err) {
    logger.error(err.name, err);
    res.status(503).json({
      'message': 'DB connection Error..!!'
    });
  });
});
router.route('/todos')
  .get(function(req, res, next) {
    TodoModel.find({}, function(err, data) { // Mongo command to fetch all data from collection.
      if (err) {
        logger.error(err);
        res.status(500).json({
          'message': 'Error fetching data'
        });
      } else {
        logger.debug(data.toString());
        res.json(data);
      }
    });
  })
  .post(function(req, res) {
    var todoModel = new TodoModel();
    todoModel.title = req.body.title;
    var completed = req.body.completed;
    if (completed === true || completed === false || completed === 'true' || completed === 'false') {
      todoModel.completed = completed;
    }
    todoModel.save(function(err, data) {
      if (err) {
        logger.error(err);
        res.status(400).json(err);
      } else {
        res.json({
          id: data._id,
          message: 'Data added'
        });
      }
    });
  });

router.use('/', function(err, req, res, next) {
  logger.error(err);
  next(err); // throw err
});

module.exports = router;
