<?php
/**
 * Loader file.
 *
 * @file
 * @package Cartive.
 */

namespace Cartive\Favorite_Artists;

use Cartive\Favorite_Artists\Admin\Favorite_Artists_Settings_Page;

defined( 'WPINC' ) || exit( 1 );

return array(
	array( Footer_Block_Controller::class, 20 ),
	array( Favorite_Artists_Settings_Page::class, 10 ),
);

