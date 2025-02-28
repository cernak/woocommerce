/**
 * External dependencies
 */
import { expect, test } from '@woocommerce/e2e-playwright-utils';

/**
 * Internal dependencies
 */

const blockData = {
	name: 'Product Details',
	slug: 'woocommerce/product-details',
};

test.describe( `${ blockData.slug } Block`, () => {
	test( "block can't be inserted in Post Editor", async ( {
		editor,
		admin,
	} ) => {
		await admin.createNewPost();
		await expect(
			editor.insertBlock( { name: blockData.slug } )
		).rejects.toThrow(
			new RegExp( `Block type '${ blockData.slug }' is not registered.` )
		);
	} );

	test( 'block should be already added in the Single Product Template', async ( {
		editorUtils,
		admin,
	} ) => {
		await admin.visitSiteEditor( {
			postId: 'woocommerce/woocommerce//single-product',
			postType: 'wp_template',
		} );
		await editorUtils.enterEditMode();
		const alreadyPresentBlock = await editorUtils.getBlockByName(
			blockData.slug
		);

		await expect( alreadyPresentBlock ).toHaveText(
			/This block lists description, attributes and reviews for a single product./
		);
	} );

	test( 'block can be inserted in the Site Editor', async ( {
		admin,
		requestUtils,
		editorUtils,
		editor,
	} ) => {
		const template = await requestUtils.createTemplate( 'wp_template', {
			// Single Product Details block is addable only in Single Product Templates
			slug: 'single-product-v-neck-t-shirt',
			title: 'Sorter',
			content: 'howdy',
		} );

		await admin.visitSiteEditor( {
			postId: template.id,
			postType: 'wp_template',
		} );

		await editorUtils.enterEditMode();

		await editor.insertBlock( {
			name: blockData.slug,
		} );

		const block = await editorUtils.getBlockByName( blockData.slug );

		await expect( block ).toHaveText(
			/This block lists description, attributes and reviews for a single product./
		);
	} );
} );
