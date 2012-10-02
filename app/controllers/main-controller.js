var url = require('url')
  , braintree = require('braintree')
  , Albums = require('../models/albums');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "p7rgv3p9yvf8r26q",
  publicKey: "svkhxft4s5rhhmr7",
  privateKey: "ad2cf98015cfdb144942baac8ff9f072"
});
var trData = gateway.transparentRedirect.transactionData({
  redirectUrl: 'http://localhost:3000/thanks',
    transaction: {
      type: 'sale',
      //amount: '10000.00', // allow users to specify donation amount
      options: {submitForSettlement: true}
    }
});

function routes(app) {
  /**
   * Route to Homepage
   */
  app.get('/', function(req, res) {
    var albumsList = new Albums("exitmusick", renderAlbums);

    albumsList.getAlbums(req, res);
  });

   /**
   * View another user's top albums
   */ 
  app.get('/view', function(req, res) {
    var albumsList
      , queryUrl
      , username;
    
    //Get the query string portion of the URL from the parsed URL object
    queryUrl = url.parse(req.url, true).query;

    // Get the username value from the query string
    username = queryUrl.username.trim();
    albumsList = new Albums(username, renderAlbums);
    albumsList.getAlbums(req, res);
  });

  /**
   * Route to About page
   */
  app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
    });
  });
  
  /**
   * Route to Contact page
   */
  app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact'
    });
  });

  /**
   * Route to Donate page
   */
  app.get('/donate', function(req, res) {
    res.render('donate', {
      title: 'Donate',
      trData: trData, 
      braintreeUrl: gateway.transparentRedirect.url,
    });
  });

  /**
   * Route to Thanks page
   */
  app.get('/thanks', function(req, res) {

    gateway.transparentRedirect.confirm(req._parsedUrl.query, function (err, result) {
      var message;
      if (result.success) {
        message = "Transaction Successful";
      }
      else {
        message = JSON.stringify(result.errors, null, 2);
      }
      res.render('thanks', {
        title: 'Thank You!',
        result: result, 
        message: message
      });
    });
  });
}

/**
 * Renders the search results page
 * @method renderAlbums
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Array} params.albumJSON A JSON object containing to top albums
 */
function renderAlbums(req, res, params) {
  res.render('home', {
    title: 'Buy Me Music',
    me: params.me,
    you: params.you,
    albumsJSON: params.albumsJSON
  });
}

module.exports = routes;