<?php
/**
 * Main Admin file.
 *
 * @file
 * FavoriteArtistsSettingsPage class.
 * @package Cartive.
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit( 1 );

delete_option( 'favorite_artists_option' );
delete_option( 'favorite_artists_list' );
