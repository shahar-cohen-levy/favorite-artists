<?php
/**
 * Spotify Search service file.
 *
 * @file
 * Spotify_Search class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists\API;

/**
 * Class for retrieving artists object from Spotify based on search.
 */
class Spotify_Search {
	/**
	 * Holds the token we get from Spotify.
	 *
	 * @var Spotify_Token $token for token.
	 */
	private Spotify_Token $token;

	/**
	 * Get token in constructor.
	 */
	public function __construct() {
		$this->token = new Spotify_Token();
	}
	/**
	 * Get artists data for certain query.
	 *
	 * @param 'query' $query passed.
	 */
	public function do_search_spotify( $query ) {
		$args     = array(
			'headers' => array( 'Authorization' => 'Bearer ' . $this->token->get_token() ),
		);
		$url      = 'https://api.spotify.com/v1/search?q=' . $query . '&type=artist&limit=5';
		$response = wp_remote_get( $url, $args );
		$body     = json_decode( wp_remote_retrieve_body( $response ) );

		$status = wp_remote_retrieve_response_code( $response );
		if ( 200 === $status ) {
			return $body->artists->items;
		}
		return $status;
	}

}
