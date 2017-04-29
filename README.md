# songkick-api-node
A full-fledged Songkick API wrapper/enhancer for Node.js.

## Overview
The Songkick API limits requests to a single page with 50 results.
This library adds the ability to fetch all results in a single call as well increase the page size above 50.

## Usage
You will first need to request a Songkick API key before using this library.
Once obtained, simply require this library and instantiate.

```
  const Songkick = require('songkick-api-node');
  const songkickApi = new Songkick('YourApiKey');
```

All requests to the library will be returned a promise and when resolved the response will be JSON.
If you would like XML responses, simply construct the library as follows:
```
const songkickApi = new Songkick('YourApiKey', { returnXML: true });
```

## API Documentation
### Events
#### searchEvents(params)
Returns a list of events based on search params.

###### Required Parameters:
* `artist_name` - The name of an artist to search for.
* `location` - The location of the event. 

Note: Requires either artist_name or location, not both.

###### Optional Parameters:
* `min_date`- The earliest date of events to return (YYYY-MM-DD).
* `max_date`- The latest date of events to return (YYYY-MM-DD).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

Note: If using either date option, both min_date and max_date are required.

###### Examples:
```js
songkickApi.searchEvents({ artist_name: 'Radiohead' });
songkickApi.searchEvents({ location: 'geo:44.9325881,-93.26754419999999' });
songkickApi.searchEvents({ location: 'sk:35130' });
```

#### getEventDetails(eventId)
Gets detailed event information, including venue information.

###### Required Parameters:
  * `eventId` - The ID of the event.
  
###### Example:
```js
songkickApi.getEventDetails(eventId);
```

#### getEventSetlist(eventId)
Gets the setlist for a specific event.

###### Required Parameters:
  * `eventId` - The ID of the event.
  
###### Example:
```js
songkickApi.getEventSetlist(eventId);
```