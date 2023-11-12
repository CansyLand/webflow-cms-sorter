// import { getAPIClient } from '@/utils/webflow_helper';
import { NextResponse } from 'next/server';
import commonHeaders from '@/utils/common_headers'
// import Webflow from 'webflow-api';

export async function GET(request: Request) {
    // const webflowAPI = getAPIClient(auth);
    // Define the options with the custom headers

    const { searchParams } = new URL(request.url);
    const bearer = searchParams.get('auth');
    const siteId = searchParams.get('siteId')

    // Is authentication in url?
    if (!searchParams.get('auth')) {
        return NextResponse.json({ok: false, error: 'Not authenticated'}, {
            headers: commonHeaders,
        });
    }
    
    
    
    // console.log(bearer)
    // console.log(siteId)



    const options = {
        method: 'GET',
        headers: {accept: 'application/json', authorization: 'Bearer ' + bearer}
      };

    try {
        // Make the API call with the options
        const response = await fetch('https://api.webflow.com/v2/sites/' + siteId + '/collections', options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return NextResponse.json(data, {
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