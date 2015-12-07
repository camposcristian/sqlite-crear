var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
res.render(__dirname + '/../views/registrausu.jade',{
	});
}); 

module.exports = router;
