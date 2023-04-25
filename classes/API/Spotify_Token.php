<?php
/**
 * Spotify Token service file.
 *
 * @file
 * Spotify_Token class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists\API;

/**
 * Class for retrieving a token from Spotify based on credentials.
 */
class Spotify_Token {
	/**
	 * Get token function.
	 */
	public function get_token() {
		$client_id     = get_option( 'favorite_artists_options' )['favorite-artists-client-id'];
		$client_secret = get_option( 'favorite_artists_options' )['favorite-artists-client-secret'];

		$args   = array(
			'headers' => array( 'Content-Type' => 'application/x-www-form-urlencoded' ),
			'body'    => 'grant_type=client_credentials&client_id=' . $client_id . '&client_secret=' . $client_secret,
		);
		$cached = get_transient( 'fa-token' );
		if ( false === $cached ) {
			$response = wp_remote_post( 'https://accounts.spotify.com/api/token', $args );
			set_transient( 'fa-token', $response, 60 * 60 );
		}
		$token_response = get_transient( 'fa-token' );
		$body           = json_decode( wp_remote_retrieve_body( $token_response ) );

		$status = wp_remote_retrieve_response_code( $token_response );
		if ( 200 === $status ) {
			return $body->access_token;
		}
		return array(
			'status' => $status,
			'body'   => $body,
		);
	}

}
