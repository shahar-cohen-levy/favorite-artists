import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import {
	TextControl,
	Card,
	CardBody,
	CardMedia,
	Spinner,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

import './editor.scss';
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   root0
 * @param {Object}   root0.attributes
 * @param {string}   root0.attributes.title
 * @param {Function} root0.setAttributes
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes: { title }, setAttributes } ) {
	const [ artists, setArtists ] = useState( null );
	const [ error, setError ] = useState( null );

	const blockProps = useBlockProps( {
		className: 'alignwide',
	} );

	useEffect( () => {
		( async () => {
			try {
				const ids = await apiFetch( {
					path: '/favorite-artists/v1/get-artists-ids',
				} );
				const artistsData = await apiFetch( {
					path: `/favorite-artists/v1/get-artist-data/${ ids }`,
				} );
				setArtists( artistsData );
				setError( null );
			} catch ( err ) {
				setArtists( null );
				setError( err );
			}
		} )();
	}, [] );

	return (
		<div { ...blockProps }>
			<TextControl
				label={ __( 'Title', 'favorite-artists-block' ) }
				value={ title }
				onChange={ ( newTitle ) =>
					setAttributes( { title: String( newTitle ) } )
				}
			/>
			<div>
				{ ! artists && ! error && <Spinner /> }

				{ error && error.message }
				{ artists &&
					artists.map( ( artist, index ) => {
						const { name, images } = artist;
						const { height, url, width } = images[ 0 ];
						return (
							<Card key={ index } className="card-custom">
								<CardMedia>
									<figure>
										<img
											src={ url }
											alt={ name }
											height={ height }
											width={ width }
										/>
									</figure>
								</CardMedia>
								<CardBody isBorderless={ true }>
									{ name }
								</CardBody>
							</Card>
						);
					} ) }
			</div>
		</div>
	);
}
