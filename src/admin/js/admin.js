import Swal from 'sweetalert2/dist/sweetalert2.js'


( function ( window, $, ajaxurl ) {
	class FavoriteArtistsAdmin {
		constructor() {
			this.artistsSection = $( '#artists-section' );
			this.artistsListWrapper = $( '.js-artists-list' );

			this.search = $( '.js-favorite-artists-search-submit' );
			this.searchInput = $( '.js-artists-search-input' );
			this.searchMsg = $( '.js-add-artist-message' );

			this.save = $( '.js-favorite-artists-search-save' );

			this.reset = $( '.js-favorite-artists-search-reset' );

			this.deleteArtist = $( '.js-favorite-artists-delete' );

			this.adminTabs = $( 'ul.fa-tabs li' );
			this.adminContent = $( '.fa-tab-content' );

			this.search.click( this.handleSearch.bind( this ) );

			this.artistsListWrapper.on(
				'click',
				'.js-favorite-artists-delete',
				this.handleDelete.bind( this )
			);

			this.adminTabs.click( this.handleTabs.bind( this ) );
		}

		// Search for an artist and suggest a result.
		handleSearch( e ) {
			e.preventDefault();
			const thisSearch = $( e.currentTarget );
			$( this.searchMsg ).show();
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
					if ( response.type === 'success' ) {
						$( this.searchInput ).val( response.name ).attr( {
							value: response.id,
						} );
						$( this.searchMsg ).hide();
						Swal.fire( {
							title: 'Add ' + response.name + '?',
							showCancelButton: true,
							confirmButtonText: 'Yes',
							cancelButtonText: 'No, I want to search again',
						} ).then( ( result ) => {
							if ( result.isConfirmed ) {
								this._handleSave( response, nonce );
								Swal.fire({
									title: response.name + ' Added!',
									text:'',
									timer: 2000,
                                    icon: 'success',
									showConfirmButton: false
									} );
							} else if ( result.isDismissed) {
								this._handleReset()
							}
						} );
					} else if ( response.type === 'artist-exists' ) {
						Swal.fire( response.name + ' is already on your list', '', '');
						$( this.searchMsg ).hide();
						this._handleReset()
					} else if ( response.type === 'empty' ){
						Swal.fire( 'Search box is empty :(', '', '');
						$( this.searchMsg ).hide();
					} else {
						Swal.fire('Something went wrong, try again', '', '');
						$( this.searchMsg ).hide();
						this._handleReset()
					}
				}
			} );
		}

		//Save selected artist to list.
		_handleSave( response, nonce ) {
			$.ajax( {
				type: 'post',
				dataType: 'json',
				url: ajaxurl,
				data: { action: 'save_id', artists_id: response.id, nonce },
				success: () => {
					$( '.js-artists-list ul li.js-no-artists' ).hide();
					$( '.js-artists-list ul' ).append(
						'<li><a class="js-favorite-artists-delete" data-nonce=' +
							nonce +
							' data-artist-id=' +
						response.id +
							' href="#"><span class="dashicons dashicons-trash"></span></a><span>' +
						response.name +
							'</span></li>'
					);
				},
				error: () => {
					Swal.fire( 'Artist not added', '', 'info' );
				},
			} );
		}

		// Reset search.
		_handleReset() {
			$( this.searchMsg ).html( '' );
			$( this.searchInput ).val( '' ).attr( {
				value: '',
			} );;
		}

		//Delete selected artist from list.
		handleDelete( e ) {
			e.preventDefault();
			const thisItem = e.currentTarget;
			const artistName = $( thisItem ).next( 'span' ).text();
			Swal.fire( {
				title: 'Delete ' + artistName + '?',
				showCancelButton: true,
				confirmButtonText: 'Yes',
				cancelButtonText: 'No',
			} ).then( ( result ) => {
				if ( result.isConfirmed ) {
					this._deleteArtists( thisItem );
					Swal.fire({
						title: artistName + ' Deleted!',
						text:'',
						timer: 2000,
						icon: 'success',
						showConfirmButton: false
					} );
				}
			} );
		}

		_deleteArtists( thisItem ) {
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
					$( thisItem ).closest( 'li' ).remove();
					// If artists list is empty show 'no artists' msg.
					if (1 === $( '.js-artists-list ul').children().length) {
						$( '.js-artists-list ul li.js-no-artists' ).show();
					}

				},
				error: () => {
					Swal.fire( 'Artist not deleted', '', 'info' );
				},
			} );
		}

		// Admin settings tabs.
		handleTabs( e ) {
			const thisTab = $( e.currentTarget );
			const tabId = $( thisTab ).attr( 'data-tab' );
			$( this.adminTabs ).removeClass( 'current' );
			$( this.adminContent ).removeClass( 'current' );
			$( thisTab ).addClass( 'current' );
			$( '#' + tabId ).addClass( 'current' );
		}
	}
	$( document ).ready( function () {
		new FavoriteArtistsAdmin();
	} );
} )( window, jQuery, ajaxurl );
