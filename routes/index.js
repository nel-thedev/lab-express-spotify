var express = require('express');
var router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/artist-search', function (req, res, next) {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      // console.log(result.body.artists.items.images)
      let artistsArr = data.body.artists.items
      res.render('artist-search-results.hbs', { artistsArr });
    })
});

router.get('/artist/:id', function (req, res, next) {
  spotifyApi.getArtistAlbums(req.params.id, { limit: 10 })
    .then((albumData) => {
      let albumArr = albumData.body.items;
      console.log(albumData.body.items)
      res.render('artist.hbs', { albumArr });
    })
});

router.get('/album/:id', function (req, res, next) {
  spotifyApi.getAlbumTracks(req.params.id)
    .then((album) => {
      let albumTracks = album.body.items;
      // console.log('make it stop ', albumTracks)
      res.render('album.hbs', { albumTracks });
    })
});

module.exports = router;
