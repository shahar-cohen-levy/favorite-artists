import Swal from 'sweetalert2/dist/sweetalert2.js'


( function ( window, $, ajaxurl ) {
	class FavoriteArtistsAdmin {
		constructor() {
			this.artistsSection = $( '#artists-section' );
			this.artistsListWrapper = $( '.js-artists-list' );

			this.searchInput = $( '.js-artists-search-input' );
			this.searchMsg = $( '.js-add-artist-message' );

			this.reset = $( '.js-favorite-artists-search-reset' );

			this.deleteArtist = $( '.js-favorite-artists-delete' );

			this.adminTabs = $( 'ul.fa-tabs li' );
			this.adminContent = $( '.fa-tab-content' );

			this.searchInput.autocomplete(this.handleSearch);

			this.artistsListWrapper.on(
				'click',
				'.js-favorite-artists-delete',
				this.handleDelete.bind( this )
			);

			this.adminTabs.click( this.handleTabs.bind( this ) );
		}

		// Search for an artist and suggest a result.

        handleSearch = {
			minLength: 3,
			source: (request, response) => {
				const nonce = this.searchInput.attr( 'data-nonce' );
				$.ajax({
					dataType: 'json',
					url: ajaxurl,
					data: {
						term: request.term,
						action: 'do_search_autocomplete',
						security: nonce,
					},
					success: (data) => {
						if (data.length > 0) {
							$(".js-empty-message").empty();
							response(data);
						} else {
                            $(".js-empty-message").text("No results found");
						}
					}
				});
			},
			select: (event, ui) => {
				const nonce = this.searchInput.attr( 'data-nonce' );
				Swal.fire( {
					title: 'Add ' + ui.item.label + '?',
					showCancelButton: true,
					confirmButtonText: 'Yes',
					cancelButtonText: 'No, I want to search again',
				} ).then( ( result ) => {
					if ( result.isConfirmed ) {
						this._handleReset();
						this._handleSave( ui.item, nonce );
					}
				} );
				// cancel event prevents the value from being set into the <input> element.
				return false;
			},
		}

		//Save selected artist to list.
		_handleSave( item, nonce ) {
			$.ajax( {
				type: 'post',
				dataType: 'json',
				url: ajaxurl,
				data: { action: 'save_id', artists_id: item.value, nonce },
				success: (response) => {
					if (response.success === true) {
						Swal.fire({
							title: item.label + ' Added!',
							text:'',
							timer: 2000,
							icon: 'success',
							showConfirmButton: false
						} );
						$( '.js-artists-list ul li.js-no-artists' ).hide();
						$( '.js-artists-list ul' ).append(
							'<li><a class="js-favorite-artists-delete" data-nonce=' +
							nonce +
							' data-artist-id=' +
							item.value +
							' href="#"><span class="dashicons dashicons-trash"></span></a><span>' +
							item.label +
							'</span></li>'
						);
					} else if (response.success === false) {
						Swal.fire({
							title: 'Artist not added',
							text: response.data,
							timer: 3000,
							icon: 'error',
							showConfirmButton: false
						} );
					}

				},
				error: () => {
					Swal.fire( 'Artist not added', '', '' );
				},
			} );
		}

		// Reset search.
		_handleReset() {
			$( this.searchMsg ).html( '' );
			$( this.searchInput )
				.val( '' )
				.attr( {
				value: '',
			} ).focus();
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
