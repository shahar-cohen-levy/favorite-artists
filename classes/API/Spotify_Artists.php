<?php
/**
 * Spotify Artists service file.
 *
 * @file
 * Spotify_Artists class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists\API;

/**
 * Class for retrieving artists object from Spotify.
 */
class Spotify_Artists {
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
	 * Get artists data for comma listed ids.
	 *
	 * @param 'ids' $ids passed.
	 */
	public function get_artists_data_spotify( $ids ) {

		$args     = array(
			'headers' => array( 'Authorization' => 'Bearer ' . $this->token->get_token() ),
		);
		$url      = 'https://api.spotify.com/v1/artists?ids=' . $ids;
		$response = wp_remote_get( $url, $args );
		$body     = json_decode( wp_remote_retrieve_body( $response ) );

		$status = wp_remote_retrieve_response_code( $response );
		if ( 200 === $status ) {
			return $body->artists;
		}
		return $status;
	}

}
