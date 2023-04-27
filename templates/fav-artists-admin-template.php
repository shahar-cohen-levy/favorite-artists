<?php
/**
 * The template for displaying admin settings page.
 *
 * @package Cartive
 */

?>
<div class="wrap">
  <div id="tabsNav">
	<ul class="fa-tabs">
	  <li class="fa-tab-link current" data-tab="settings-section">
		<span><?php esc_html_e( 'API Settings' ); ?></span>
	  </li>
	  <li class="fa-tab-link" data-tab="artists-section">
				<span><?php esc_html_e( 'Favorite Artists' ); ?><span>
	  </li>
	</ul>
  </div>
  <form method="post" action="options.php" id="settings-section" class="fa-tab-content current">

	<?php
	settings_fields( 'favorite-artists-settings-group' );
	do_settings_sections( 'setting-admin' );
	submit_button();
	?>
  </form>
  <div class="fa-tab-content" id="artists-section">
	  <h2>Search and add your favorite artists!</h2>
	<input type="text" id="artists-search" class="js-artists-search-input" name="favorite_artists_options[artists-ids]" value="" />
	  <a class="button button-primary js-favorite-artists-search-submit" data-nonce="
	  <?php
		/** @var TYPE_NAME $args */
		echo esc_attr( $args['fa_search_nonce'] )
		?>
	" href="#"><?php esc_html_e( 'Search' ); ?></a>
	  <div class="js-add-artist-message"></div>
	<div class="js-add-artists-section" style="display: none">
	  <a class="button button-primary js-favorite-artists-search-save" data-nonce="<?php echo esc_attr( $args['fa_search_nonce'] ); ?>" href="#" ><?php esc_html_e( 'Yes' ); ?>!</a>
	  <a class="button button-secondary js-favorite-artists-search-reset" href="#"><?php esc_html_e( 'No, I want search again' ); ?></a>
	</div>

	<div class="js-artists-list">

		<h2><?php esc_html_e( 'Current Artists on your list' ); ?></h2>
	  <ul>
		  <?php
			if ( $args['artists'] ) {

				foreach ( $args['artists'] as $artist ) {
					echo '<li><a class="js-favorite-artists-delete" data-nonce=' . esc_attr( $args['fa_search_nonce'] ) . ' data-artist-id=' . esc_html( $artist->id ) . ' href="#"><span class="dashicons dashicons-trash"></span></a><span>' . esc_html( $artist->name ) . '</span></li>';
				}
			} else {
						  echo '<li class="hide-me">' . esc_html( 'No artists yet, add some!' ) . '</li>';
			}
			?>
	  </ul>
		<div class="js-delete-artist-message"></div>
	</div>

  </div>
</div>
