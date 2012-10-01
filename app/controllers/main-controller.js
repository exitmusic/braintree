var braintree = require('braintree');

function routes(app) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "p7rgv3p9yvf8r26q",
    publicKey: "svkhxft4s5rhhmr7",
    privateKey: "ad2cf98015cfdb144942baac8ff9f072"
  });

  /**
   * Route to Homepage
   */
  app.get('/', function(req, res) {
    var trData = gateway.transparentRedirect.transactionData({
      redirectUrl: 'http://localhost:3000/braintree',
        transaction: {
          type: 'sale',
          amount: '10000.00',
          options: {submitForSettlement: true}
        }
    });
    res.render('home', {
        title: 'Braintree Albums',
        trData: trData, 
        braintreeUrl: gateway.transparentRedirect.url
    });
  });
  
  /**
   * Route to About page (not currently used)
   */
  app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
    });
  });
  
  /**
   * Route to Contact page (not currently used)
   */
  app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact'
    });
  });
}

module.exports = routes;