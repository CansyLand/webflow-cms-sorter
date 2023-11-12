import { NextResponse } from 'next/server';
import commonHeaders from '@/utils/common_headers';

export async function PATCH(request: Request) {
    
    try {
        const { token: bearer, collectionId, itemId, sortField, newSortValue } = await request.json();

        const patchOptions = {
            method: 'PATCH',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Bearer ' + bearer
            },
            body: JSON.stringify({ isArchived: false, isDraft: false, fieldData: { [sortField]: newSortValue } })
        };

        const response = await fetch(`https://api.webflow.com/v2/collections/${collectionId}/items/${itemId}`, patchOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const item = await response.json();
        return NextResponse.json(item, {
            headers: commonHeaders,
        });

    } catch (error) {
        console.error('Error in PATCH request:', error);
        return new Response(JSON.stringify({ error: 'Failed to update item' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
