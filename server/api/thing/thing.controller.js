

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');


/**
 * @api {get} /things   Get list of things
 * @apiName index
 * @apiGroup things
 * @apiSuccess {array}  Get list of things  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(things);
  });
};


/**
 * @api {get} /things/:id   Get Selected Thing 
 * @apiName show
 * @apiGroup thing
 * @apiSuccess {json}  Get selected thing  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    return res.json(thing);
  });
};

/**
 * @api {post} /   Create things 
 * @apiName create
 * @apiGroup thing
 * @apiSuccess {json}  created thing  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(thing);
  });
};

/**
 * @api {put} /thing:/id update selected thing
 * @apiName update
 * @apiGroup thing
 * @apiSuccess {string}  no content  
 * @apiError 500-InternalServerError SERVER error.
 */
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(thing);
    });
  });
};


/**
 * @api {delete} /thing:/id   delete selected thing
 * @apiName destroy
 * @apiGroup thing
 * @apiSuccess {string}  No content
 * @apiError 500-InternalServerError SERVER error. ,404 Not Found
 */
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    thing.deleteOne(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}