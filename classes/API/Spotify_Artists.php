<?php
/**
 * Spotify Artists service file.
 *
 * @file
 * Spotify_Artists class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists\API;

use Peast\Syntax\Exception;

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

		try {
			$response = wp_remote_get( $url, $args );
			$body     = json_decode( wp_remote_retrieve_body( $response ) );

			if ( null !== $body->artists[0] ) {
				return $body->artists;
			}
			return 404;

		} catch ( \Exception $e ) {
			return $e->getCode();
		}

	}

}
