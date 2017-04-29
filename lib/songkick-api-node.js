'use strict';
const Q = require('q');
const querystring = require('querystring');
const request = require('request');
const util = require('util');

function Songkick(apiKey, opts) {
  opts = opts || {};

  this.config = {
    apiKey: apiKey,
    returnType: opts.returnXML ? '.xml' : '.json',
  }
}

Songkick.prototype = {
  /*
   Returns an event given an eventId
   @eventId: the id of an event you want details for
   */
  getEventDetails(eventId) {
    let endPoint = util.format('/events/%s', eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'event');
  },
  /*
   Returns an event's setlist
   @eventId: the id of an event you want its setlist for
   */
  getEventSetlist(eventId) {
    let endPoint = util.format('/events/%s/setlists', eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'setlist');
  },
  /*
   Returns a tracking for an event a user has tracked
   @username: the username of the user you want to get a tracking of an event for
   @eventId: the id of the event you want to get a user's tracking for
   */
  getEventTracking(username, eventId) {
    let endPoint = util.format('/users/%s/trackings/event:%s', username, eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  /*
   Returns a list of artists similar to a given artist
   @artistId: the id of an artist you want to find similar artists for
   */
  getSimilarArtists(artistId) {
    let endPoint = util.format('/artists/%s/similar_artists', artistId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'artist');
  },
  /*
   Returns upcoming events for an artist
   @artistId: the id of an artist you want to find upcoming events for
   @params:
   Required: N/A
   Optional: @order, @page, @per_page
   @order: The chronological order you want the events returned in
   - can be one of (asc, desc)
   - default is asc
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getArtistCalendar(artistId, params) {
    let endPoint = util.format('/artists/%s/calendar', artistId);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns events an artist has performed in in the past
   @artistId: the id of an artist you want to get past events for
   @params:
   Required: N/A
   Optional: @order, @page, @per_page,
   @order: The chronological order you want the events returned in
   - can be one of (asc, desc)
   - default is asc
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getArtistPastEvents(artistId, params) {
    let endPoint = util.format('/artists/%s/gigography', artistId);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns a tracking for an artist a user has tracked
   @username: the username of the user you want to get a tracking of an artist for
   @artistId: the id of the artist you want to get a user's tracking for
   */
  getArtistTracking(username, artistId) {
    let endPoint = util.format('/users/%s/trackings/artist:%s', username, artistId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  /*
   Returns a venue given a venueId
   @venueId: the id of a venue you want details for
   */
  getVenue(venueId) {
    let endPoint = util.format('/venues/%s', venueId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'venue');
  },
  /*
   Returns upcoming events for a venue
   @venueId: the id of a venue you want to get upcoming events for
   @params:
   Required: N/A
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getVenueCalendar(venueId, params) {
    let endPoint = util.format('/venues/%s/calendar', venueId);
    let url = buildUrl(endPoint, this.config, params, ['page', 'per_page']);
    return makeRequest(url, 'event');
  },
  /*
   Returns upcoming events for a metro area
   @metroAreaId: the id of a metro area you want to get upcoming events for
   @params:
   Required: N/A
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getMetroAreaCalendar(metroAreaId, params) {
    let endPoint = util.format('/metro_areas/%s/calendar', metroAreaId);
    let url = buildUrl(endPoint, this.config, params, ['page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns a tracking for a metro area a user has tracked
   @username: the username of the user you want to get a tracking of a metro area for
   @metroAreaId: the id of the metro area you want to get a user's tracking for
   */
  getMetroAreaTracking(username, metroAreaId) {
    let endPoint = util.format('/users/%s/trackings/metro_area:%s', username, metroAreaId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  /*
   Returns a list of calendar entries with events for a user’s tracked artists in their tracked metro areas.
   @username: the username of a user you want to get upcoming events for
   @params:
   Required: N/A
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserCalendar(username, params) {
    params.reason = 'tracked_artist';
    let endPoint = util.format('/users/%s/calendar', username);
    let url = buildUrl(endPoint, this.config, params, ['tracked_artist', 'page', 'per_page']);

    return makeRequest(url, 'calendarEntry');
  },
  /*
   Returns events a user is planning to attend
   @username: the username of a user you want to get upcoming events for
   @params:
   Required: N/A
   Optional: @attendance, @created_after, @order, @page, @per_page,
   @attendance: the status of a user's event attendance.
   - can be one of: (all, im_going, i_might_go)
   - default is im_going
   @created_after: specify to only return events created after the given date
   - <timestamp> using ISO8601 format, e.g. 2012-02-29T13:37:00Z
   @order: The chronological order you want the events returned in
   - can be one of (asc, desc)
   - default is asc
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserEvents(username, params) {
    let endPoint = util.format('/users/%s/events', username);
    let url = buildUrl(endPoint, this.config, params, ['attendance', 'created_after', 'order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns events a user has attended in the past
   @username: the username of a user you want to get past events for
   @params:
   Required: N/A
   Optional: @order, @page, @per_page,
   @order: The chronological order you want the events returned in
   - can be one of (asc, desc)
   - default is asc
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserPastEvents(username, params) {
    let endPoint = util.format('/users/%s/gigography', username);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns artists a user is tracking
   @username: the username of a user you want to get tracked artists for
   @params:
   Required: N/A
   Optional: @created_at, @page, @per_page,
   @created_after: specify to only return artists tracked after a given date
   - <timestamp> using ISO8601 format, e.g. 2012-02-29T13:37:00Z
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserTrackedArtists(username, params) {
    let endPoint = util.format('/users/%s/artists/tracked', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  /*
   Returns metro areas a user is tracking
   @username: the username of a user you want to get tracked metro areas for
   @params:
   Required: N/A
   Optional: @created_after, @page, @per_page,
   @created_after: specify to only return metro areas tracked after a given date
   - <timestamp> using ISO8601 format, e.g. 2012-02-29T13:37:00Z
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserTrackedMetroAreas(username, params) {
    let endPoint = util.format('/users/%s/metro_areas/tracked', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'metroArea');
  },
  /*
   Returns artists a user used to track, but is not currently tracking
   @username: the username of a user you want to get artists that user used to tracking, but is not currently tracking for
   @params:
   Required: N/A
   Optional: @created_after, @page, @per_page,
   @created_after: specify to only return muted artists from after a given date
   - <timestamp> using ISO8601 format, e.g. 2012-02-29T13:37:00Z
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  getUserMutedArtists(username, params) {
    let endPoint = util.format('/users/%s/artists/muted', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  /*
   Returns a list of artists based on search params
   @params:
   Required: @query
   @query: full text search based on artist's name
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  searchArtists(params) {
    if (!params.query) {
      throw '{query} must be include in the parameters you pass in';
    }

    let url = buildUrl('/search/artists', this.config, params, ['query', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  /*
   Returns a list of locations based on search params
   @params:
   Required: @query OR @location
   @query: full text search based on artist's name
   @location: Search for locations closest to the location type provided.  Location type's can be of the forms:
   - geo:<lat>,<lng>: Localise based on latitude / longitude. Use decimal degrees positive = north and east.
   - ip:<ip>: Localise based on an IP address. Return all results if address is not present in our database.
   - clientip: Localise based on IP address of client. Useful for purely client side implementations.
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  searchLocations(params) {
    if (!(params.query || params.location)) {
      throw '{query} OR {location} must be include in the parameters you pass in';
    }
    let url = buildUrl('/search/locations', this.config, params, ['query', 'location', 'page', 'per_page']);

    return makeRequest(url, 'location');
  },
  /*
   Returns a list of events based on search params
   @params:
   Required: @artist_name OR @location
   @artist_name: name of an artist to search for
   @location: can take one of the following forms:
   - sk:<id>: Localise based on a Songkick metro area ID
   - geo:<lat>,<lng>: Localise based on latitude / longitude. Use decimal degrees positive = north and east.
   - ip:<ip>: Localise based on an IP address. Return all results if address is not present in our database.
   - clientip: Localise based on IP address of client. Useful for purely client side implementations.
   - (nothing): Return all results.
   Optional: (@min_date AND @max_date), @page, @per_page
   @min_date: earliest date of events to return (date format: YYYY-MM-DD)
   @max_date: latest date of events to return (date format: YYYY-MM-DD)
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  searchEvents(params) {
    if (!(params.location || params.artist_name)) {
      throw '{location} OR {artist_name} must be include in the parameters you pass in';
    }
    if ((params.min_date || params.max_date) && !(params.min_date && params.max_date)) {
      throw 'If pass in {min_date} OR {max_data} as parameters, you must include both';
    }

    let url = buildUrl('/events', this.config, params, ['artist_name', 'location', 'min_date', 'max_date', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  /*
   Returns a list of venues based on search params
   @params:
   Required: @query
   @query: full text search based on venue's name
   Optional: @page, @per_page
   @page: offset for paginated results (first page = 1)
   @per_page: number of results for paginated results (max 50)
   */
  searchVenues(params) {
    if (!params.query) {
      throw '{query} must be include in the parameters you pass in';
    }
    let url = buildUrl('/search/venues', this.config, params, ['query', 'page', 'per_page']);

    return makeRequest(url, 'venue');
  }
};

function buildUrl(endPoint, config, params, allowedParams) {
  params = params || {};
  let baseUrl = 'http://api.songkick.com/api/3.0';
  let queryString = querystring.stringify(filterParams(params, allowedParams));

  return baseUrl + endPoint + config.returnType + '?' + queryString + '&apikey=' + config.apiKey;
}

function makeRequest(url, resultType) {
  let deferred = Q.defer();

  request.get(url, function (error, response, body) {
    try {
      body = JSON.parse(body);
      if (body.resultsPage.status === 'error') {
        deferred.reject(body.resultsPage.error);
        return;
      }
      deferred.resolve(body.resultsPage.results[resultType]);
    } catch (err) {
      deferred.reject(err);
    }
  });

  return deferred.promise;
}

function filterParams(params, allowedParams) {
  for (let paramName in params) {
    if (allowedParams.indexOf(paramName) === -1) {
      delete params[paramName];
    }
  }

  return params;
}

module.exports = Songkick;
