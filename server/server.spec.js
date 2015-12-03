'use strict';

var expect, request, app;

function checkIndexHtml(Test, done) {
  Test.expect(200)
    .expect('Content-Type', /text\/html/)
    .expect(function(res) {
      expect(res.text).to.be.a('string');
      expect(res.text).to.have.string('<title>AngularJS • TodoMVC<\/title>');
    })
    .end(function(err, res) {
      return err ? done(err) : done();
    });
}

expect = require('chai').expect;
request = require('supertest');
app = require('./server');

describe('GET /', function() {
  it('/ should respond with index.html', function(done) {
    checkIndexHtml(request(app).get('/'), done);
  });
});

describe('GET *', function() {
  it('/abcd should respond with index.html', function(done) {
    checkIndexHtml(request(app).get('/abcd'), done);
  });
});
