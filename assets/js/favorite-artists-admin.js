jQuery(document).ready( function($) {
    // Search for an artist and suggest a result.
    $('.js-favorite-artists-search-submit').click(function (e) {
        e.preventDefault();
        const artists_query = $( "#artists-search" ).val();
        const nonce = $(this).attr("data-nonce")
        const self = this;
        $.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            data : {action: "do_search", artists_query: artists_query, nonce: nonce},
            success: function(response) {
                if(response.type === "artist") {
                    $(".js-artists-search-input").val(response.name).attr({
                        'value': response.id
                    });
                    $(self).hide();
                    $('.js-add-artist-message').html('Add ' + response.name + '?');
                    $('.js-favorite-artists-search-save, .js-add-artists-section').show();
                }
                else {
                    $('.js-add-artist-message').html('Something went wrong :(');
                }
            },
            error: function (response) {
                $('.js-add-artist-message').html('Something went wrong :(');            }
        });
    })

    //Save selected artist to list.
    $('.js-favorite-artists-search-save').click(function (e) {
        e.preventDefault();
        const search_input = $( ".js-artists-search-input" );
        const artists_id = search_input.attr( "value" );
        const artists_name = search_input.val();
        const nonce = $(this).attr("data-nonce")
        const self = this;
        $.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            data : {action: "save_id", artists_id: artists_id, nonce: nonce},
            success: function(response) {
                $('.js-add-artist-message').html( artists_name + ' Added!');
                $(self).hide();
                $('.js-favorite-artists-search-reset').html('Search and add more');
                $('.js-artists-list ul li.hide-me').hide();
                $('.js-artists-list ul').append('<li>' + artists_name +'</li>');
            },
            error: function () {
                $('.js-add-artist-message').html( 'Artist not added :(');
                $(self).hide();
                $('.js-favorite-artists-search-reset').html('Try again')
            }
        });
    })

    // Reset search.
    $('.js-favorite-artists-search-reset').click(function (e) {
        e.preventDefault();
        $('.js-favorite-artists-search-submit').show();
        $('.js-add-artists-section').hide();
        $( '.js-artists-search-input').val('');
    })

    // Admin settings tabs.
    $('ul.fa-tabs li').click(function () {
        const tab_id = $(this).attr('data-tab');
        $('ul.fa-tabs li').removeClass('current');
        $('.fa-tab-content').removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

});