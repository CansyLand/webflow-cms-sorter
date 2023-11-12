import { NextResponse } from 'next/server';
import commonHeaders from '@/utils/common_headers'
// import Webflow from 'webflow-api';

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const bearer = searchParams.get('auth');
    const collectionId = searchParams.get('collectionId')

    // Is authentication in url?
    if (!searchParams.get('auth')) {
        return NextResponse.json({ok: false, error: 'Not authenticated'}, {
            headers: commonHeaders,
        });
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + bearer}
    };

    try {
        // Get all items in collection
        const responseItems = await fetch('https://api.webflow.com/v2/collections/' + collectionId + '/items' , options);
        if (!responseItems.ok) {
            throw new Error(`HTTP error! status: ${responseItems.status}`);
        }

        // Get data over Collection
        const responseCollectionDetails = await fetch('https://api.webflow.com/v2/collections/' + collectionId, options)
        if (!responseCollectionDetails.ok) {
            throw new Error(`HTTP error! status: ${responseCollectionDetails.status}`);
        }

        const collectionDetails = await responseCollectionDetails.json();
        const collection = await responseItems.json();
        return NextResponse.json({collection, collectionDetails}, {
            headers: commonHeaders,
        })
    } catch (error) {
        return Response.json({
            message: 'There was an error fetching the data',
            error: error
        }, {
            headers: commonHeaders,
        })
    }
}