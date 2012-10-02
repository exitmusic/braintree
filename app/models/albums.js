var http = require('http');

function Albums(user, view) {
  this.user = user;
  this.view = view;
}

Albums.prototype.getAlbums = function(req, res, cb) {

  //http://ws.audioscrobbler.com/2.0/
  //?method=user.gettopalbums&user=rj&api_key=b25b959554ed76058ac220b7b2e0a026&format=json
  //API key:c0335ebae11bfd93e2910dd2f061a8c3
  //API secret: 7e12ae370041350ab556107d869dd59c

  var viewCallback = this.view;
  var username = this.user;

  var options = {
    host: 'ws.audioscrobbler.com',
    path: '/2.0/?method=user.gettopalbums&user='+username+'&api_key=c0335ebae11bfd93e2910dd2f061a8c3&format=json'
  };

  var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      viewCallback(req, res, {me: "exitmusick", you: username, albumsJSON: JSON.parse(str).topalbums.album});
    });
  };

  http.get(options, callback);
}

module.exports = Albums;
