(function() {

  $(document).ready(function() {
    $("a.donate-cash").bind("click", function(e) {
      e.preventDefault();

      $("div.modal-body").load('/donate .donate-content', function() {
        $("div.modal").modal();
      });
      $("#submit-donation").on('click', function() {
        $("#payment-form").submit();
      });
    })
  });

})();