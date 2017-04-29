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

## Artists API
### getArtistUpcomingEvents(artistId, params)
Returns events an artist has performed in in the past.

###### Required Parameters:
* `artistId` - The ID of the artist.

###### Optional Parameters:
* `order` - The order you want the events returned in. Either 'asc' or 'desc'), defaults is 'asc'.
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.getArtistUpcomingEvents(253846);
songkickApi.getArtistUpcomingEvents(253846, { order: 'desc' });
songkickApi.getArtistUpcomingEvents(253846, { order: 'desc', page: 4, per_page: 25 });
```

### getArtistPastEvents(artistId, params)
Returns events an artist has performed in in the past.

###### Required Parameters:
* `artistId` - The ID of the artist.

###### Optional Parameters:
* `order` - The order you want the events returned in. Either 'asc' or 'desc'), defaults is 'asc'.
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.getArtistPastEvents(253846);
songkickApi.getArtistPastEvents(253846, { order: 'desc' });
songkickApi.getArtistPastEvents(253846, { order: 'desc', page: 4, per_page: 25 });
```

### getArtistSimilar(artistId)
Returns a list of artists similar to a given artist.

###### Required Parameters:
* `artistId` - The ID of the artist.

###### Example:
```js
songkickApi.getArtistSimilar(253846);
```

### searchArtists(params)
Returns a list of artists based on search string.

###### Required Parameters:
* `query` - The searched string.

###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Example:
```js
songkickApi.searchArtists({ query: 'Radiohead' });
songkickApi.searchArtists({ query: 'Radiohead', page: 6 });
```

## Events API
### searchEvents(params)
Returns a list of events based on search params.

###### Required Parameters:
* `artist_name` - The name of an artist to search for.
* `location` - The location of the event. 

Note: Requires either `artist_name` or `location` but not both.

###### Optional Parameters:
* `min_date`- The earliest date of events to return (YYYY-MM-DD).
* `max_date`- The latest date of events to return (YYYY-MM-DD).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

Note: If using either of the date options, both `min_date` and `max_date` are then required.

###### Examples:
```js
songkickApi.searchEvents({ artist_name: 'Radiohead' });
songkickApi.searchEvents({ location: 'geo:44.9325881,-93.26754419999999' });
songkickApi.searchEvents({ location: 'sk:35130' });
```

### getEventDetails(eventId)
Returns detailed event information, including venue information.

###### Required Parameters:
  * `eventId` - The ID of the event.

###### Example:
```js
songkickApi.getEventDetails(11129128);
```

### getEventSetlist(eventId)
Returns the setlist for a specific event.

###### Required Parameters:
  * `eventId` - The ID of the event.

###### Example:
```js
songkickApi.getEventSetlist(11129128);
```

## Venue API
### getVenue(venueId)
Returns details about a given venue.

###### Required Parameters:
  * `venueId` - The ID of the venue.

###### Example:
```js
songkickApi.getVenue(17522);
```

### getVenueUpcomingEvents(venueId, params)
Returns upcoming events for a given venue.

###### Required Parameters:
  * `venueId` - The ID of the venue.
  
###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.getVenueUpcomingEvents(17522);
songkickApi.getVenueUpcomingEvents(17522, { page: 5, per_page: 10 });
```

### searchVenues(params)
Returns a list of venues based on search params.

###### Required Parameters:
  * `query` - The searched venue string.

###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.searchVenues({ query: 'First Avenue' });
songkickApi.searchVenues({ query: '7th Street Entry', page: 5, per_page: 25 });
```

## Locations API
### searchLocations(params)
Returns a list of locations based on search params.

###### Required Parameters:
* `query` - The name of an location to search for.
* `location` - The lat/lng, ip, or clientip of the location.

Note: Requires either `query` or `location` but not both.

###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.searchLocations({ query: 'New York City' });
songkickApi.searchLocations({ query: 'New York City', page: 4, per_page: 25 });
songkickApi.searchLocations({ location: 'geo:44.9325881,-93.26754419999999' });
songkickApi.searchLocations({ location: 'ip:127.0.0.1' });
songkickApi.searchLocations({ location: 'clientip:127.0.0.1' });
```

### getLocationUpcomingEvents(metroAreaId, params)
Returns upcoming events for a metro location.

###### Required Parameters:
  * `metroAreaId` - The ID of the metro area to get upcoming events for.

###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).

###### Examples:
```js
songkickApi.getLocationUpcomingEvents(35130);
songkickApi.getLocationUpcomingEvents(35130, { page: 5, per_page: 25 });
```
