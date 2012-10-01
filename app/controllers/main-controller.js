var braintree = require('braintree')
  , Albums = require('../models/albums');

function routes(app) {
  /**
   * Route to Homepage
   */
  app.get('/', function(req, res) {
    var albumsList = new Albums('exitmusick', renderAlbums);
    
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
   * Route to Thanks page
   */
  app.get('/thanks', function(req, res) {
    res.render('thanks', {
        title: 'Thank You!'
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
        amount: '10000.00',
        options: {submitForSettlement: true}
      }
  });

  res.render('home', {
    title: 'Buy Me Music',
    trData: trData, 
    braintreeUrl: gateway.transparentRedirect.url,
    albumsJSON: params.albumsJSON
  });
}

module.exports = routes;