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
* `order` - The order you want the events returned in. Either 'asc' or 'desc'. Defaults is 'asc'.
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


## Location API
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


## User API
### getUserArtistTracking(username, artistId)
Returns tracking information for a single artist a user has tracked.

###### Required Parameters:
* `username` - The username of the user.
* `artistId` - The ID of the artist.
  
###### Example:
```js
songkickApi.getUserArtistTracking('user_123', 253846);
```

### getUserTrackedArtists(username, params)
Returns artists the user is tracking.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `created_after`- Return artists tracked after given date (ISO8601 formatted).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserTrackedArtists('user_123');
songkickApi.getUserTrackedArtists('user_123', { created_after: '2012-02-29T13:37:00Z' });
songkickApi.getUserTrackedArtists('user_123', { created_after: '2012-02-29T13:37:00Z', page: 3, per_page: 25 });
```

### getUserMutedArtists(username, params)
Returns a list of artists the user used to track but is no longer.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `created_after`- Return artists stopped tracking after given date (ISO8601 formatted).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserMutedArtists('user_123');
songkickApi.getUserMutedArtists('user_123', { created_after: '2012-02-29T13:37:00Z' });
songkickApi.getUserMutedArtists('user_123', { created_after: '2012-02-29T13:37:00Z', page: 3, per_page: 25 });
```

### getUserTrackedMetroAreas(username, params)
Returns a list of metro areas a user is tracking.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `created_after`- Return metro areas tracked after given date (ISO8601 formatted).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserTrackedMetroAreas('user_123');
songkickApi.getUserTrackedMetroAreas('user_123', { created_after: '2012-02-29T13:37:00Z' });
songkickApi.getUserTrackedMetroAreas('user_123', { created_after: '2012-02-29T13:37:00Z', page: 3, per_page: 25 });
```

### getUserMetroAreaTracking(username, metroAreaId)
Returns a tracking object for a metro area that the user is tracking.

###### Required Parameters:
* `username` - The username of the user.
* `metroAreaId` - The ID of the metro area.

###### Optional Parameters:
* `created_after`- Return artists stopped tracking after given date (ISO8601 formatted).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Example:
```js
songkickApi.getUserMetroAreaTracking('user_123', 35130);
```

### getUserEventTracking(username, eventId)
Returns a tracking object for an event the user has tracked.

###### Required Parameters:
* `username` - The username of the user.
* `eventId` - The ID of the metro area.

###### Example:
```js
songkickApi.getUserEventTracking('user_123', 11129128);
```

### getUserCalendar(username, params)
Returns a list of calendar entries with events for a user’s tracked artists in their tracked metro areas.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserCalendar('user_123');
songkickApi.getUserCalendar('user_123', { page: 3, per_page: 25 });
```

### getUserUpcomingEvents(username, params)
Returns a list of events the user is planning to attend.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `attendance`- The status of a user's event attendance. Options include 'all', 'im_going', 'i_might_go'. Defaults to 'im_going'.
* `created_after`- Return artists stopped tracking after given date (ISO8601 formatted).
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserUpcomingEvents('user_123');
songkickApi.getUserUpcomingEvents('user_123', { attendance: 'all', page: 3, per_page: 25 });
songkickApi.getUserUpcomingEvents('user_123', { attendance: 'i_might_go', created_after: '2012-02-29T13:37:00Z' });
```

### getUserPastEvents(username, params)
Returns a list of events the user has attended in the past.

###### Required Parameters:
* `username` - The username of the user.

###### Optional Parameters:
* `order`- The order you want the events returned in. Either 'asc' or 'desc'. Defaults is 'asc'.
* `page`- The offset for paginated results (first page = 1).
* `per_page`- The number of results for paginated results (max 50).  

###### Examples:
```js
songkickApi.getUserPastEvents('user_123');
songkickApi.getUserPastEvents('user_123', { order: 'desc' });
songkickApi.getUserPastEvents('user_123', { order: 'desc', page: 4, per_page: 25 });
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
