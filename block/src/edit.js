import { __ } from '@wordpress/i18n';

import { useBlockProps } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { TextControl, Card, CardBody, CardMedia } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

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
	const [ isLoading, setLoading ] = useState( true );
	const [ artists, setArtists ] = useState( {} );
	const isStillMounted = useRef();
	const props = useBlockProps();

	useEffect( () => {
		isStillMounted.current = true;
		apiFetch( { path: '/favorite-artists/v1/get-artists-ids' } )
			.then( ( ids ) => {
				if ( isStillMounted.current ) {
					apiFetch( {
						path: `/favorite-artists/v1/get-artist-data/${ ids }`,
					} )
						.then( ( artistsData ) => {
							setArtists( artistsData );
							setLoading( false );
						} )
						.catch( () => {
							setLoading( false );
							setArtists( {} );
						} );
				}
			} )
			.catch( () => {
				if ( isStillMounted.current ) {
					setLoading( false );
				}
			} );
	}, [ setArtists, setLoading, isStillMounted ] );

	if ( isLoading ) {
		return <div { ...props }>Loading...</div>;
	}

	const artistsCards = artists.map( ( artist, index ) => (
		<Card key={ index }>
			<CardMedia>
				<img src={ artist.images[ 0 ].url } alt={ artist.name } />
			</CardMedia>
			<CardBody>{ artist.name }</CardBody>
		</Card>
	) );

	return (
		<div { ...props() }>
			<TextControl
				label={ __( 'Title', 'favorite-artists-block' ) }
				value={ title }
				onChange={ ( newTitle ) =>
					setAttributes( { title: String( newTitle ) } )
				}
			/>
			<div>{ artistsCards }</div>
		</div>
	);
}
