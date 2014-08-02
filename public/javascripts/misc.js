(function() {
  this.AJAX = (function(doc, $) {
    function favoriteFriend(friendId, cb) {

      cb();
    }

    return {
      favoriteFriend: favoriteFriend
    };
  })(document, jQuery);

  $('#search-friends input').keyup(function(e) {
    var search = $(this).val();
    $('.friend').each(function(i, friend) {
      if (friend.childNodes[0].innerHTML.toLowerCase().indexOf(search.toLowerCase()) < 0) {
        friend.style.display = 'none';
      } else {
        if (friend.style.display == 'none') {
          friend.style.display = 'block';
        }
      }
    });
  });
  $('.favorite-friend').click(function(e) {
    console.log($(this).closest('li').data('fid'));
  });
})();
