<?php
/**
 * Footer block file.
 *
 * @file
 * Footer_Block_Controller class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists;

use Cartive\Favorite_Artists\API\Spotify_Artists;

/**
 * Main class for Footer block.
 */
class Footer_Block_Controller {
	/**
	 * Start up
	 */
	public function __start(): void {
		add_action( 'wp_footer', array( $this, 'print_block' ) );
	}
	/**
	 * Print block.
	 */
	public function print_block():void {
		$ids                 = get_option( 'favorite_artists_list' );
		$artists             = new Spotify_Artists();
		$artists_data        = $artists->get_artists_data_spotify( $ids );
		$overridden_template = locate_template( 'favorite-artists-footer-block.php' );
		if ( $overridden_template ) {
			load_template(
				$overridden_template,
				true,
				array(
					'data' => $artists_data,
				)
			);
		} else {
			load_template(
				dirname( __DIR__ ) . '/templates/favorite-artists-footer-block.php',
				true,
				array(
					'data' => $artists_data,
				)
			);
		}

	}
}
