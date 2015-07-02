var express = require('express'),
    mongoose = require('mongoose');
var Artist = require('../models/artist');
var router = express.Router();

/* GET artists listing. */

function listArtists(done) {
    Artist.find({}, function(err, artists) {
        if (err)
            return err;

        var artistMap = {};

        artists.forEach(function(artist) {
            artistMap[artist._id] = artist;
        });

        return done(artistMap);
    });
}

router.get('/:artistId', function(req, res) {
    Artist.find({
        artistId: req.params.artistId
    }).exec(function(err, artists) {
        if (err)
            return res.send(err);
        else if (artists.length === 0)
            res.status(404).json({
                msg: 'Not found'
            });
        res.json(artists[0]);
    });
});

router.get('/', function(req, res) {
    listArtists(function(obj) {
        res.json(obj);
    });
});

router.post('/', function(req, res) {
    var artist = new Artist();
    artist.artistId = req.body.artistId;
    artist.name = req.body.name;
    artist.genreList = req.body.genreList;
    artist.save(function(err) {
        if (err)
            return res.send(err);
        else
            res.json(req.body);
    });
});

router.put('/:artistId', function(req, res) {
    Artist.find({
        artistId: req.params.artistId
    }).exec(function(err, artists) {
        if (err)
            return res.send(err);
        else if (artists.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        var artist = artists[0];
        artist.artistId = req.body.artistId;
        artist.name = req.body.name;
        artist.genreList = req.body.genreList;
        artist.save(function(err) {
            if (err)
                return res.send(err);
            else
                res.status(200).json(req.body);
        });
    });
});

router.delete('/:artistId', function(req, res) {
    Artist.find({
        artistId: req.params.artistId
    }).exec(function(err, artists) {
        if (err)
            return res.status(400).send(err);
        else if (artists.length === 0) {
            return res.status(404).json({
                msg: 'Not found'
            });
        }
        Artist.remove({
            artistId: req.params.artistId
        }, function(err) {
            if (err)
                return res.status(400).send(err);
            res.json({
                msg: 'Artist has been deleted'
            });
        });
    });
});

module.exports = router;