var braintree = require('braintree');

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "p7rgv3p9yvf8r26q",
  publicKey: "svkhxft4s5rhhmr7",
  privateKey: "ad2cf98015cfdb144942baac8ff9f072"
});

/*
 * GET home page.
 */
exports.index = function(req, res) {
  //res.render('index', { title: 'Express' });

  var trData = gateway.transparentRedirect.transactionData({
    redirectUrl: 'http://localhost:3000/braintree',
      transaction: {
        type: 'sale',
        amount: '10000.00',
        options: {submitForSettlement: true}
      }
  });

  res.render('index', {title: 'Express', trData: trData, braintreeUrl: gateway.transparentRedirect.url});
};
