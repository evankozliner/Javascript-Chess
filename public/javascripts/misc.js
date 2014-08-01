(function() {
  $('#search-friends input').keyup(function(e) {
    var search = $(this).val();
    $('.friend').each(function(i, friend) {
      if (friend.childNodes[0].innerHTML.indexOf(search)) {
        friend.style.display = 'none';
      } else {
        if (friend.style.display == 'none') {
          friend.style.display = 'block';
        }
      }
    });
  });
})();
