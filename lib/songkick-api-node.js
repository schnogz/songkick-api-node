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
  getEventDetails(eventId) {
    let endPoint = util.format('/events/%s', eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'event');
  },
  getEventSetlist(eventId) {
    let endPoint = util.format('/events/%s/setlists', eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'setlist');
  },
  getEventTracking(username, eventId) {
    let endPoint = util.format('/users/%s/trackings/event:%s', username, eventId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  getArtistSimilar(artistId) {
    let endPoint = util.format('/artists/%s/similar_artists', artistId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'artist');
  },
  getArtistUpcomingEvents(artistId, params) {
    let endPoint = util.format('/artists/%s/calendar', artistId);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  getArtistPastEvents(artistId, params) {
    let endPoint = util.format('/artists/%s/gigography', artistId);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  getArtistTracking(username, artistId) {
    let endPoint = util.format('/users/%s/trackings/artist:%s', username, artistId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  getVenue(venueId) {
    let endPoint = util.format('/venues/%s', venueId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'venue');
  },
  getVenueCalendar(venueId, params) {
    let endPoint = util.format('/venues/%s/calendar', venueId);
    let url = buildUrl(endPoint, this.config, params, ['page', 'per_page']);
    return makeRequest(url, 'event');
  },
  getMetroAreaCalendar(metroAreaId, params) {
    let endPoint = util.format('/metro_areas/%s/calendar', metroAreaId);
    let url = buildUrl(endPoint, this.config, params, ['page', 'per_page']);

    return makeRequest(url, 'event');
  },
  getMetroAreaTracking(username, metroAreaId) {
    let endPoint = util.format('/users/%s/trackings/metro_area:%s', username, metroAreaId);
    let url = buildUrl(endPoint, this.config);

    return makeRequest(url, 'tracking');
  },
  getUserCalendar(username, params) {
    params.reason = 'tracked_artist';
    let endPoint = util.format('/users/%s/calendar', username);
    let url = buildUrl(endPoint, this.config, params, ['tracked_artist', 'page', 'per_page']);

    return makeRequest(url, 'calendarEntry');
  },
  getUserUpcomingEvents(username, params) {
    let endPoint = util.format('/users/%s/events', username);
    let url = buildUrl(endPoint, this.config, params, ['attendance', 'created_after', 'order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  getUserPastEvents(username, params) {
    let endPoint = util.format('/users/%s/gigography', username);
    let url = buildUrl(endPoint, this.config, params, ['order', 'page', 'per_page']);

    return makeRequest(url, 'event');
  },
  getUserTrackedArtists(username, params) {
    let endPoint = util.format('/users/%s/artists/tracked', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  getUserTrackedMetroAreas(username, params) {
    let endPoint = util.format('/users/%s/metro_areas/tracked', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'metroArea');
  },
  getUserMutedArtists(username, params) {
    let endPoint = util.format('/users/%s/artists/muted', username);
    let url = buildUrl(endPoint, this.config, params, ['created_after', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  searchArtists(params) {
    if (!params.query) {
      throw '{query} must be include in the parameters you pass in';
    }

    let url = buildUrl('/search/artists', this.config, params, ['query', 'page', 'per_page']);

    return makeRequest(url, 'artist');
  },
  searchLocations(params) {
    if (!(params.query || params.location)) {
      throw '{query} OR {location} must be include in the parameters you pass in';
    }
    let url = buildUrl('/search/locations', this.config, params, ['query', 'location', 'page', 'per_page']);

    return makeRequest(url, 'location');
  },
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
