jQuery(document).ready( function($) {
    // Search for an artist and suggest a result.
    $('.js-favorite-artists-search-submit').click(function (e) {
        e.preventDefault();
        $('.js-add-artist-message').html('Searching...')
        const artists_query = $( "#artists-search" ).val();
        const search_input = $(".js-artists-search-input")
        const nonce = $(this).attr("data-nonce")
        const self = this;
        $.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            data : {action: "do_search", artists_query: artists_query, nonce: nonce},
            success: function(response) {
                if(response.type === "artist") {
                    $(search_input).val(response.name).attr({
                        'value': response.id
                    });
                    $(search_input).prop('disabled', true);
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
        $('.js-add-artist-message').html( 'saving...');
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
                $('.js-artists-list ul').append('<li><a class="js-favorite-artists-delete" data-nonce=' + nonce + ' data-artist-id='+ artists_id +' href="#"><span class="dashicons dashicons-trash"></span></a><span>'+ artists_name + '</span></li>');
            },
            error: function () {
                $('.js-add-artist-message').html( 'Artist not added :(');
                $(self).hide();
                $('.js-favorite-artists-search-reset').html('Try again')
            }
        });
    })

    // Reset search.
    $('#artists-section').on('click', '.js-favorite-artists-search-reset, .js-favorite-artists-delete',(function (e) {
        e.preventDefault();
        $('.js-favorite-artists-search-submit').show();
        $('.js-add-artists-section').hide();
        $('.js-add-artist-message').html('')
        $( '.js-artists-search-input').val('');
        $('.js-artists-search-input').prop('disabled', false);
    }))

    //Delete selected artist from list.
    $('.js-artists-list ').on('click', '.js-favorite-artists-delete', (function (e) {
        e.preventDefault();
        $('.js-delete-artist-message').html( 'deleting...');
        const artists_id = $(this).attr("data-artist-id")
        const nonce = $(this).attr("data-nonce")
        const self = this;
        $.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            data : {action: "delete_id", artists_id: artists_id, nonce: nonce},
            success: function(response) {
                $('.js-delete-artist-message').html( 'Artist deleted!');
                $(self).closest('li').remove();
            },
            error: function () {
                $('.js-delete-artist-message').html( 'Artist not deleted :(');
            }
        });
    }))

    // Admin settings tabs.
    $('ul.fa-tabs li').click(function () {
        const tab_id = $(this).attr('data-tab');
        $('ul.fa-tabs li').removeClass('current');
        $('.fa-tab-content').removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

});