import { NextResponse } from 'next/server';
import commonHeaders from '@/utils/common_headers';

/**
 * 
 * @param request 
 * @returns 
 * {
    "id": "1d2aa4dd0854289913bd0b91f79473cc",
    "isEditable": true,
    "isRequired": false,
    "type": "Number",
    "slug": "sort-app",
    "displayName": "Sort App",
    "helpText": "This field is used by the Sort App to manage the order of this collection.",
    "validations": {
        "format": "integer",
        "allowNegative": true,
        "precision": 1
        }
    }
 */

export async function POST(request) {
    // Extract 'auth' and 'collectionId' from request
    const { token: bearer, collectionId } = await request.json();

    // Define the POST request options
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer ' + bearer
        },
        body: JSON.stringify({
          isRequired: false,
          type: 'Number',
          slug: 'sort-app',
          displayName: 'Sort App',
          helpText: 'This field is used by the Sort App to manage the order of this collection.'
        })
    };

    try {
        // Make the POST request to Webflow API to create a new field
        const postResponse = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/fields`, options);
        if (!postResponse.ok) {
            throw new Error(`HTTP error! status: ${postResponse.status}`);
        }

        const fieldData = await postResponse.json();
        const slug = fieldData.slug;

        // Fetch all items in the collection
        const getOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer ' + bearer
            }
        };
        const responseItems = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items`, getOptions);
        if (!responseItems.ok) {
            throw new Error(`HTTP error! status: ${responseItems.status}`);
        }
        const collection = await responseItems.json();

        // Sort items by date and update each item with a new sorting number
        let sortingNumber = 100000;
        for (const item of collection.items.sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime())) {
            const patchOptions = {
                method: 'PATCH',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  authorization: 'Bearer ' + bearer
                },
                body: JSON.stringify({isArchived: false, isDraft: false, fieldData: {[slug]: sortingNumber }})
            };
            const response = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items/${item.id}`, patchOptions);
            //console.log(await response.json())
            sortingNumber += 1000;
        }

        // Return the successful response
        return NextResponse.json({ message: 'Field created and items updated successfully' }, {
            headers: commonHeaders,
        });


    } catch (err) {
        console.error(err);
        // Return error response
        return NextResponse.json({
            message: 'There was an error processing your request',
            error: err.message
        }, {
            headers: commonHeaders,
        });
    }
}