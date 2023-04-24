<?php
/**
 * Custom Route file.
 *
 * @file
 * Favorite_Artists_Custom_Route class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists;

use Cartive\Favorite_Artists\API\Spotify_Artists;
use WP_Error;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Main class.
 */
class Favorite_Artists_Custom_Route {

	/**
	 * Start things up.
	 */
	public function __start(): void {
		add_action(
			'rest_api_init',
			function() {
				register_rest_route(
					'favorite-artists/v1',
					'/get-artists-ids',
					array(
						'methods'             => WP_REST_SERVER::READABLE,
						'callback'            => array( $this, 'fa_get_ids' ),
						'args'                => array(),
						'permission_callback' => function () {
							return true;
						},
					)
				);
			}
		);

		add_action(
			'rest_api_init',
			function() {
				register_rest_route(
					'favorite-artists/v1',
					'/get-artist-data/(?P<id>[\S]+)',
					array(
						'methods'             => WP_REST_SERVER::READABLE,
						'callback'            => array( $this, 'fa_get_artist_data' ),
						'args'                => array(
							'id' => array(),
						),
						'permission_callback' => function () {
							return true;
						},
					)
				);
			}
		);

	}


	/**
	 * Get ids from options.
	 *
	 * @return \WP_Error|\WP_HTTP_Response|\WP_REST_Response
	 */
	public function fa_get_ids() {
		$ids = get_option( 'favorite_artists_list' );
		return rest_ensure_response( $ids );
	}

	/**
	 * Get artist data and prepare a request.
	 *
	 * @param 'Request' $request from callback.
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function fa_get_artist_data( $request ) {
		$id          = $request['id'];
		$artists     = new Spotify_Artists();
		$artist_data = $artists->get_artists_data_spotify( $id );
		if ( 404 === $artist_data ) {
			return new WP_Error( 'wrong_id', 'This id is not valid', array( 'status' => 404 ) );

		}
		$response = new WP_REST_Response( $artist_data );
		$response->set_status( 200 );

		return $response;
	}



}
