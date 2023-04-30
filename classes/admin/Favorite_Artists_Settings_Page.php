<?php
/**
 * Main Admin file.
 *
 * @file
 * FavoriteArtistsSettingsPage class.
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists\Admin;

use Cartive\Favorite_Artists\API\Spotify_Artists;
use Cartive\Favorite_Artists\API\Spotify_Search;
/**
 * Main class for Admin settings page.
 */
class Favorite_Artists_Settings_Page {

	/**
	 * Holds the values to be used in the fields callbacks.
	 *
	 * @var array|bool $options
	 */
	private $options;

	 /**
	  * Holds current ids data.
	  *
	  * @var string|null $current_ids
	  */
	private $current_ids;

	/**
	 * Holds the ids of artists to be used to show current artists in options.
	 *
	 * @var array|int $artists
	 */

	private $artists;
	public function __construct() {
		$this->options     = get_option( 'favorite_artists_options' );
		$this->current_ids = get_option( 'favorite_artists_list' );
	}

	/**
	 * Start up
	 */
	public function __start() {
		add_action( 'admin_menu', array( $this, 'favorite_artists_add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'favorite_artists_register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_scripts' ) );
		add_action( 'wp_ajax_do_search', array( $this, 'do_search' ) );
		add_action( 'wp_ajax_save_id', array( $this, 'save_id' ) );
		add_action( 'wp_ajax_delete_id', array( $this, 'delete_id' ) );
	}
	/**
	 * Add options page
	 */
	public function favorite_artists_add_settings_page() {
		// This page will be under "Settings".
		add_options_page(
			'Favorite Artists Settings',
			'Favorite Artists',
			'manage_options',
			'favorite-artists-settings',
			array( $this, 'favorite_artists_render_settings_page' )
		);
	}

	/**
	 * Options page callback
	 */
	public function favorite_artists_render_settings_page() {
		// Set class properties.

		$artists = new Spotify_Artists();

			$this->current_ids ? $this->artists = $artists->get_artists_data_spotify( $this->current_ids ) : $this->artists = null;
			$fa_search_nonce                    = wp_create_nonce( 'fa_search_nonce' );
			load_template(
				FAVORITE_ARTISTS_PLUGIN_ROOT . '/templates/fav-artists-admin-template.php',
				true,
				array(
					'fa_search_nonce' => $fa_search_nonce,
					'artists'         => $this->artists,
				)
			);

	}

	/**
	 * Register and add settings
	 */
	public function favorite_artists_register_settings() {
		register_setting(
			'favorite-artists-settings-group',
			'favorite_artists_options',
			array( $this, 'sanitize' )
		);

		add_settings_section(
			'favorite-artists-settings-section',
			'Spotify API credentials',
			array( $this, 'print_section_info' ),
			'setting-admin'
		);

		add_settings_field(
			'favorite-artists-client-id',
			'Client Id',
			array( $this, 'favorite_artists_client_id_callback' ),
			'setting-admin',
			'favorite-artists-settings-section'
		);

		add_settings_field(
			'favorite-artists-client-secret',
			'Client Secret',
			array( $this, 'favorite_artists_render_client_secret' ),
			'setting-admin',
			'favorite-artists-settings-section'
		);
	}
	/**
	 * Load js and css.
	 *
	 * @param 'hook' $hook to get the current path.
	 */
	public function load_scripts( $hook ): void {
		if ( 'settings_page_favorite-artists-settings' !== $hook ) {
			return;
		}
		$css_file_path = glob( plugin_dir_path( FAVORITE_ARTISTS_PLUGIN_FILE ) . '/assets/css/admin.min.*.css' );
		$css_file_uri  = plugin_dir_url( FAVORITE_ARTISTS_PLUGIN_FILE ) . '/assets/css/' . basename( $css_file_path[0] );
		wp_enqueue_style( 'admin_css', $css_file_uri, array(), '1' );

		$js_file_path = glob( plugin_dir_path( FAVORITE_ARTISTS_PLUGIN_FILE ) . 'assets/js/admin.min.*.js' );
		$js_file_uri  = plugin_dir_url( FAVORITE_ARTISTS_PLUGIN_FILE ) . 'assets/js/' . basename( $js_file_path[0] );
		wp_enqueue_script( 'admin_js', $js_file_uri, null, null, true );

	}

	/**
	 * Search ajax call.
	 */
	public function do_search() {
		if ( isset( $_REQUEST['nonce'] ) ) {
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), 'fa_search_nonce' ) ) {
				exit();
			}
		}
		if ( isset( $_POST['search_query'] ) ) {
			$query    = sanitize_text_field( wp_unslash( $_POST['search_query'] ) );
			$search   = new Spotify_Search();
			$response = $search->do_search_spotify( $query );
			echo wp_json_encode( $response );
		}

		wp_die();
	}

	/**
	 * Save artist id ajax callback.
	 */
	public function save_id() {
		if ( isset( $_REQUEST['nonce'] ) ) {
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), 'fa_search_nonce' ) ) {
				exit();
			}
		}
		if ( isset( $_POST['artists_id'] ) ) {
			$id  = sanitize_text_field( wp_unslash( $_POST['artists_id'] ) );
			$ids = get_option( 'favorite_artists_list' );
			if ( $ids ) {
				$all_ids = $ids . ',' . $id;
			} else {
				$all_ids = $id;
			}
			update_option( 'favorite_artists_list', $all_ids );
			echo wp_json_encode( $id );
		}
		wp_die();
	}

	/**
	 * Save artist id ajax callback.
	 */
	public function delete_id() {
		if ( isset( $_REQUEST['nonce'] ) ) {
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), 'fa_search_nonce' ) ) {
				exit();
			}
		}
		if ( isset( $_POST['artists_id'] ) ) {
			$id  = sanitize_text_field( wp_unslash( $_POST['artists_id'] ) );
			$ids = get_option( 'favorite_artists_list' );

			$updated_ids           = str_replace( $id, '', $ids );
			$updated_ids_validated = preg_replace( array( '/^,/', '/,$/', '/([,])\1+/' ), array( '', '', '$1' ), $updated_ids );

			update_option( 'favorite_artists_list', $updated_ids_validated );
			echo wp_json_encode( $id );
		}
		wp_die();
	}


	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys.
	 */
	public function sanitize( $input ) {
		$new_input = array();
		if ( isset( $input['favorite-artists-client-id'] ) ) {
			$new_input['favorite-artists-client-id'] = sanitize_text_field( $input['favorite-artists-client-id'] );
		}

		if ( isset( $input['favorite-artists-client-secret'] ) ) {
			$new_input['favorite-artists-client-secret'] = sanitize_text_field( $input['favorite-artists-client-secret'] );
		}

		return $new_input;
	}

	/**
	 * Print the Section text
	 */
	public function print_section_info() {
		print 'Enter your credentials from Spotify below:';
	}
	/**
	 * Get the settings option array and print one of its values
	 */
	public function favorite_artists_client_id_callback() {
		printf(
			'<input type="text" id="favorite-artists-client-id" name="favorite_artists_options[favorite-artists-client-id]" value="%s" />',
			isset( $this->options['favorite-artists-client-id'] ) ? esc_attr( $this->options['favorite-artists-client-id'] ) : ''
		);
	}

	/**
	 * Get the settings option array and print one of its values
	 */
	public function favorite_artists_render_client_secret() {
		printf(
			'<input type="text" id="favorite-artists-client-secret" name="favorite_artists_options[favorite-artists-client-secret]" value="%s" />',
			isset( $this->options['favorite-artists-client-secret'] ) ? esc_attr( $this->options['favorite-artists-client-secret'] ) : ''
		);
	}


}
