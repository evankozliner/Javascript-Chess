(function() {
  this.AJAX = (function(doc, $) {
    function favoriteFriend(friendId, cb) {
      $.ajax({
        url: '/user/favorite/' + friendId,
        type: 'GET',
        success: function(data) {
          cb(data.friend);
        },
        error: function(err) {
          console.log(err);
        }
      });
    }
    function unfavoriteFriend(friendId, cb) {
      $.ajax({
        url: '/user/unfavorite/' + friendId,
        type: 'GET',
        success: function(data) {
          cb(data.friend);
        },
        error: function(err) {
          console.log(err);
        }
      });
    }

    return {
      favoriteFriend: favoriteFriend,
      unfavoriteFriend: unfavoriteFriend
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
  $('#search-favorites input').keyup(function(e) {
    var search = $(this).val();
    $('.favorite').each(function(i, favorite) {
      if (favorite.childNodes[0].innerHTML.toLowerCase().indexOf(search.toLowerCase()) < 0) {
        favorite.style.display = 'none';
      } else {
        if (favorite.style.display == 'none') {
          favorite.style.display = 'block';
        }
      }
    });
  });
  $('.expand-details').click(function(e) {
    if ($(this).hasClass('fa-plus')) {
      $(this).removeClass('fa-plus').addClass('fa-minus');
    } else {
      $(this).removeClass('fa-minus').addClass('fa-plus');
    }
    $(this).closest('li').find('.friend-details').slideToggle(150);
    return false;
  });
  $('.friend').click(function(e) {
    $(this).find('.expand-details').click();
    return false;
  });
  function prepareFavoriteButtons() {
    $('.favorite-friend').click(function(e) {
      $('.favorite-friend').off('click');
      var $friend =  $(this).closest('li');
      var friendId = $friend.data('fid'),
          isFavorite = $friend.attr('data-favorited') == 'true' ? true : false,
          cb;

      if (!isFavorite) {
        if ($('#no-favorites').is(':visible')) {
          $('#no-favorites').toggle();
          $('#favorites-list').fadeToggle(200);
        }
        cb = function(friend) {
          var $li = $(document.createElement('li')),
                $columnName = $(document.createElement('div')),
                $columnIcons = $(document.createElement('div')),
                  $row = $(document.createElement('div')),
                    $columnIcon1 = $(document.createElement('div')),
                      $spanFavorite = $(document.createElement('span')),
                    $columnIcon2 = $(document.createElement('div')),
                      $spanSend = $(document.createElement('span'));

          $spanSend.attr('title', 'send game invite').addClass('fa fa-send-o');
          $columnIcon2.append($spanSend).addClass('column half icon');

          $spanFavorite.attr('title', 'unfavorite friend').addClass('fa fa-star favorite-friend');
          $columnIcon1.append($spanFavorite).addClass('column half icon');

          $row.append($columnIcon1).append($columnIcon2).addClass('row clearfix');

          $columnIcons.append($row).addClass('column percent-25');

          $columnName.addClass('column percent-75').text(friend.name);

          $li.append($columnName).append($columnIcons).addClass('favorite row clearfix transparent-container').attr('data-fid', friend.id).attr('data-favorited', true);

          $('#favorites-list').append($li);

          $('li[data-fid="' + friend.id + '"]').attr('data-favorited', true);
          $('li[data-fid="' + friend.id + '"]').find('.favorite-friend').removeClass('fa-star-o').addClass('fa-star');
          prepareFavoriteButtons();
        }
        AJAX.favoriteFriend(friendId, cb);
      } else {
        cb = function(friend) {
          var $favorite = $('.favorite[data-fid="' + friend.id + '"]');
          $('.friend[data-fid="' + friend.id + '"]').attr('data-favorited', false).find('.favorite-friend').removeClass('fa-star').addClass('fa-star-o');
          $favorite.fadeOut(200)
          setTimeout(function() {
            $favorite.remove();
            if ($('#favorites-list').children().length === 1) {
              $('#favorites-list').hide();
              $('#no-favorites').show();
            }
          }, 200);
          prepareFavoriteButtons();
        }
        AJAX.unfavoriteFriend(friendId, cb);
      }
    });
  }
  prepareFavoriteButtons();
})();
