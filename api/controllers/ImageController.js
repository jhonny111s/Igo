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

	create: function(req, res) {

		msg = validateRequest(req);

    if (!_.isEmpty(msg)) {
      return res.badRequest(msg);
    }

		Image.create(req.allParams())
		.then(function(user) {
			return res.json(201, { id: user.id });
		})
		.catch(function(err) {
			console.log('create error');
			return res.badRequest(err);
		});
	},

	update : function(req, res){
		Image.update({id:req.param('id')},req.allParams())
		.then(function(user) {
			if(_.isEmpty(user)) {
				return res.json(204, 'No Content');
			}
			return res.ok(user);
		})
		.catch(function(err) {
			console.log('update error');
			return res.badRequest(err);
		});

	}

};
