<?php
/**
 * Main file.
 *
 * @file
 * @package Cartive.
 */

/*
Plugin Name: Favorite Artists
Plugin URI: https://github.com/your/repo
Description: Adds favorite artists to content using SpotifyAPI.
Version: 1.0.0
Author: Shahar Cohen
Requires PHP: 7.4
Requires at least: 5.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Favorite Artists is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, version 3 of the License.

Favorite Artists is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

You should have received a copy of the GNU General Public License
along with Favorite Artists. If not, see http://www.gnu.org/licenses/gpl-3.0.html
*/

use Cartive\Favorite_Artists\Core\Main;

// prevents PHP files from being executed via direct browser access.
defined( 'WPINC' ) || exit( 1 );
const FAVORITE_ARTISTS_PLUGIN_ROOT = __DIR__;
const FAVORITE_ARTISTS_PLUGIN_FILE = __FILE__;

try {
	// check composer autoload.
	$autoload = __DIR__ . '/vendor/autoload.php';
	if ( ! file_exists( $autoload ) ) {
		throw new Error(
			sprintf(
				// translators: %s is the `composer install` command.
				esc_html__( 'Missing Composer autoload. You need run %s.', 'favorite-artists' ),
				'<code>composer install</code>'
			)
		);
	}
	include_once $autoload;
} catch ( Throwable $e ) {
	return add_action(
		'admin_notices',
		function () use ( $e ) {
			if ( ! current_user_can( 'install_plugins' ) ) {
					return;
			}
			[ $plugin_name ] = get_file_data( __FILE__, [ 'plugin name' ] );
			$message         = sprintf(
				/* translators: %1$s is replaced with plugin name and %2$s with an error message */
				esc_html__( 'Error on %1$s plugin activation: %2$s', 'favorite-artists' ),
				'<strong>' . esc_html( $plugin_name ) . '</strong>',
				'<br><code>' . esc_html( $e->getMessage() ) . '</code>'
			);
			echo "<div class='notice notice-error'><p>$message</p></div>";
	} );
}

// run the plugin.
Main::start_plugin( __FILE__ );
