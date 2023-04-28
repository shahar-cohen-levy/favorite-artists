jQuery( document ).ready( function ( $ ) {
	const search = $( '.js-favorite-artists-search-submit' );
	const searchInput = $( '.js-artists-search-input' );
	const searchMsg = $( '.js-add-artist-message' );

	const save = $( '.js-favorite-artists-search-save' );

	const reset = $( '.js-favorite-artists-search-reset' );

	const deleteArtist = $( '.js-favorite-artists-delete' );
	const deleteMsg = $( '.js-delete-artist-message' );

	const adminTabs = $( 'ul.fa-tabs li' );
	const adminContent = $( '.fa-tab-content' );

	// Search for an artist and suggest a result.
	$( search ).click( ( e ) => {
		e.preventDefault();
		const thisSearch = $( e.currentTarget );
		$( searchMsg ).html( 'Searching...' );
		const searchQuery = $( '#artists-search' ).val();
		const nonce = $( thisSearch ).attr( 'data-nonce' );
		$.ajax( {
			type: 'post',
			dataType: 'json',
			url: ajaxurl,
			data: {
				action: 'do_search',
				search_query: searchQuery,
				nonce,
			},
			success: ( response ) => {
				if ( response.type === 'artist' ) {
					$( searchInput ).val( response.name ).attr( {
						value: response.id,
					} );
					$( searchInput ).prop( 'disabled', true );
					$( thisSearch ).hide();
					$( searchMsg ).html( 'Add ' + response.name + '?' );
					$( save ).add( reset ).show();
					$( deleteMsg ).html( '' );
				} else {
					$( searchMsg ).html( 'Something went wrong :(' );
				}
			},
			error: () => {
				$( searchMsg ).html( 'Something went wrong :(' );
			},
		} );
	} );

	//Save selected artist to list.
	$( save ).click( ( e ) => {
		e.preventDefault();
		const thisSave = $( e.currentTarget );
		$( searchMsg ).html( 'saving...' );
		const artistsId = searchInput.attr( 'value' );
		const artistsName = searchInput.val();
		const nonce = $( thisSave ).attr( 'data-nonce' );
		$.ajax( {
			type: 'post',
			dataType: 'json',
			url: ajaxurl,
			data: { action: 'save_id', artists_id: artistsId, nonce },
			success: () => {
				$( searchMsg ).html( artistsName + ' Added!' );
				$( thisSave ).hide();
				$( reset ).html( 'Search and add more' );
				$( '.js-artists-list ul li.hide-me' ).hide();
				$( '.js-artists-list ul' ).append(
					'<li><a class="js-favorite-artists-delete" data-nonce=' +
						nonce +
						' data-artist-id=' +
						artistsId +
						' href="#"><span class="dashicons dashicons-trash"></span></a><span>' +
						artistsName +
						'</span></li>'
				);
			},
			error: () => {
				$( searchMsg ).html( 'Artist not added :(' );
				$( thisSave ).hide();
				$( reset ).html( 'Try again' );
			},
		} );
	} );

	// Reset search.
	$( '#artists-section' ).on(
		'click',
		'.js-favorite-artists-search-reset, .js-favorite-artists-delete',
		function ( e ) {
			e.preventDefault();
			$( search ).show();
			$( save ).add( reset ).hide();
			$( searchMsg ).html( '' );
			$( searchInput ).val( '' ).prop( 'disabled', false );
		}
	);

	//Delete selected artist from list.
	$( '.js-artists-list' ).on(
		'click',
		'.js-favorite-artists-delete',
		( e ) => {
			e.preventDefault();
			const thisItem = $( e.currentTarget );
			$( deleteMsg ).html( 'deleting...' );
			const artistsId = $( thisItem ).attr( 'data-artist-id' );
			const nonce = $( thisItem ).attr( 'data-nonce' );
			$.ajax( {
				type: 'post',
				dataType: 'json',
				url: ajaxurl,
				data: {
					action: 'delete_id',
					artists_id: artistsId,
					nonce,
				},
				success: () => {
					$( deleteMsg ).html( 'Artist deleted!' );
					$( thisItem ).closest( 'li' ).remove();
				},
				error: () => {
					$( deleteMsg ).html( 'Artist not deleted :(' );
				},
			} );
		}
	);

	// Admin settings tabs.
	$( adminTabs ).click( ( e ) => {
		const thisTab = $( e.currentTarget );
		const tabId = $( thisTab ).attr( 'data-tab' );
		$( adminTabs ).removeClass( 'current' );
		$( adminContent ).removeClass( 'current' );
		$( thisTab ).addClass( 'current' );
		$( '#' + tabId ).addClass( 'current' );
	} );
} );
