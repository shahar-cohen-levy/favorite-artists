<?php
/**
 * Dependencies file.
 *
 * @file
 * @package Cartive.
 */

defined( 'WPINC' ) || exit( 1 );


$deps = array(
	array(
		'check'   => 'wordpress:4.9',
		'message' => 'You must have WordPress version is v4.9 or later',
	),
);


return $deps;
