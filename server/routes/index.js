/**
 * Created by lukedowell on 8/3/15.
 */
var express = require('express');
var path = require('path');
var people = require('../public/data/people');
var router = express.Router();


router.get('/data', function(req, res) {
    res.send(people);
});

router.get('/*', function(req, res) {
    var file = req.params[0] || 'views/index.html';
    res.sendFile(path.join(__dirname, '../public', file));
});

module.exports = router;