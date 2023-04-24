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
use WP_Block;

/**
 * Main class custom block.
 */
class Favorite_Artists_Block_Controller {
	/**
	 * Start up
	 */
	public function __start(): void {
		add_action( 'init', array( $this, 'favorite_artists_block_block_init' ) );
	}
	/**
	 * Init block.
	 */
	public function favorite_artists_block_block_init() {
		register_block_type(
			FAVORITE_ARTISTS_PLUGIN_ROOT . '/block/build',
			array(
				'render_callback' => array( $this, 'favorite_artist_block_render_callback' ),
			)
		);
	}
	/**
	 * Print block.
	 *
	 * @param array    $attributes     The array of attributes for this block.
	 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function favorite_artist_block_render_callback( array $attributes, string $content, WP_Block $block_instance ) {
		$ids          = get_option( 'favorite_artists_list' );
		$artists      = new Spotify_Artists();
		$artists_data = $artists->get_artists_data_spotify( $ids );

		ob_start();
		require FAVORITE_ARTISTS_PLUGIN_ROOT . '/templates/favorite-artists-block-template.php';
		return ob_get_clean();

	}
}
