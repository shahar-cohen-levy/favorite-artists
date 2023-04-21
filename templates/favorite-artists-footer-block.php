<?php
/**
 * The template for displaying the Favorite artists.
 *
 * @package Cartive
 */

/**
 * Data coming from class.
 *
 * @var array $args
 */
$artists = $args['data'];
?>
<div>
	<h2><?php esc_html_e( 'My favorite artists' ); ?></h2>
  <div>
	  <?php
		if ( ! empty( $artists ) ) {
			foreach ( $artists as $artist ) {
				?>
			  <img src="<?php echo esc_attr( $artist->images[0]->url ); ?>" alt="<?php echo esc_attr( $artist->name ); ?>">
				<?php
			}
		}
		?>
  </div>
</div>
