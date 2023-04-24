<?php
/**
 * All of the parameters passed to the function where this file is being required are accessible in this scope:
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
 *
 * @package gutenberg-examples
 */

?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	if ( isset( $attributes['title'] ) ) {
		?>
	<h2>
		<?php
		esc_html(
			printf(
				'%s',
				$attributes['title']
			),
		);
		?>
	</h2>
	<?php } ?>
	<div>
		<?php
		if ( ! empty( $artists_data ) ) {
			foreach ( $artists_data as $artist ) {
				?>
				<img src="<?php echo esc_attr( $artist->images[0]->url ); ?>" alt="<?php echo esc_attr( $artist->name ); ?>">
				<?php
			}
		}
		?>
	</div>
</div>
