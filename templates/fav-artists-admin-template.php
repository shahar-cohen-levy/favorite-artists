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
	  <li class="fa-tab-link" data-tab="settings-section">
		<span><?php esc_html_e( 'API Settings' ); ?></span>
	  </li>
	  <li class="fa-tab-link current" data-tab="artists-section">
				<span><?php esc_html_e( 'Favorite Artists' ); ?><span>
	  </li>
	</ul>
  </div>
    <form method="post"
          action="options.php"
          id="settings-section"
          class="fa-tab-content">

		<?php
		settings_fields( 'favorite-artists-settings-group' );
		do_settings_sections( 'setting-admin' );
		submit_button();
		?>
    </form>
  <div class="fa-tab-content current" id="artists-section">
	  <h2>Search and add your favorite artists!</h2>
	<input type="text" id="artists-search" class="js-artists-search-input" name="favorite_artists_options[artists-ids]" data-nonce="<?php echo esc_attr( $args['fa_search_nonce'] ) ?>" value="" />
	  <div class="js-add-artist-message hide-me"><img src="/wp-includes/js/thickbox/loadingAnimation.gif" alt="loading"> </div>
      <div class="js-empty-message"></div>
      <div class="js-artists-list">

		<h2><?php esc_html_e( 'Current Artists on your list' ); ?></h2>
	  <ul>

		  <?php
			if ( $args['artists'] ) {
                echo '<li class="js-no-artists hide-me">' . esc_html( 'No artists yet, add some!' ) . '</li>';
				foreach ( $args['artists'] as $artist ) {
					echo '<li><a class="js-favorite-artists-delete" data-nonce=' . esc_attr( $args['fa_search_nonce'] ) . ' data-artist-id=' . esc_html( $artist->id ) . ' href="#"><span class="dashicons dashicons-trash"></span></a><span>' . esc_html( $artist->name ) . '</span></li>';
				}
			} else {
				echo '<li class="js-no-artists">' . esc_html( 'No artists yet, add some!' ) . '</li>';
            }
			?>
	  </ul>
	</div>

  </div>
</div>
