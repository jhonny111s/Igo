/**
 * ImageController
 *
 * @description :: Server-side logic for managing images
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function validateRequest(req) {
  console.log(req.allParams());
  mesagge = {};

  if (_.isUndefined(req.param('name'))) {
    mesagge.EV04 = 'An name is required!';
  }

  if (_.isUndefined(req.param('path'))) {
    mesagge.EV01 = 'An path is required!';
  }

  if (_.isUndefined(req.param('description'))) {
    mesagge.EV02 = 'A description is required!';
  }

  return mesagge;
}


module.exports = {

  /**
 {SERVER_URL}:{SERVER_PORT}/image/:ObjectId

 {
  "code": 200,
  "message": "image data",
  "data": [
    {
      "path": "dir/carpeta/archivo.ext",
      "description": "imagen cualquiera",
      "user": "2",
      "name": "archivo",
      "createdAt": "2016-04-30T01:23:46.234Z",
      "updatedAt": "2016-04-30T01:23:46.234Z",
      "id": "57240922d21ca35411e5109a"
    }
  ]
}

 **/
  find: function(req, res) {
    Image.find({
        id: req.param('id')
      })
      .then(function(image) {
        console.log(req.param('id'));
        console.log(image);
        if (!_.isEmpty(image)) {
          return res.send({
            "code": 200,
            "message": "OK",
            "data": [image[0]]
          });
        } else {
          return res.send({
            "code": 204,
            "message": "No content",
            "data": []
          });
        }
      })
      .catch(function(err) {
        return res.send({
          "code": 500,
          "message": "Error to get image",
          "data": err
        });
      });
  },

  findAll: function(req, res) {
    Image.find({})
      .then(function(image) {
        console.log(req.param('id'));
        console.log(image);
        if (!_.isEmpty(image)) {
          return res.send({
            "code": 200,
            "message": "OK",
            "data": [image]
          });
        } else {
          return res.send({
            "code": 204,
            "message": "No content",
            "data": []
          });
        }
      })
      .catch(function(err) {
        return res.send({
          "code": 500,
          "message": "Error to get image",
          "data": err
        });
      });
  },

  create: function(req, res) {
    msg = validateRequest(req);
    if (!_.isEmpty(msg)) {
      return res.badRequest(msg);
    }
    Image.create(req.allParams())
      .then(function(image) {
        return res.json(201, {
          id: image.id
        });
      })
      .catch(function(err) {
        console.log('create error');
        return res.badRequest(err);
      });
  },

  update: function(req, res) {
    Image.update({
        id: req.param('id')
      }, req.allParams())
      .then(function(image) {
        if (_.isEmpty(image)) {
          return res.json(204, 'No Content');
        }
        return res.ok(image);
      })
      .catch(function(err) {
        console.log('update error');
        return res.badRequest(err);
      });

  }

};
