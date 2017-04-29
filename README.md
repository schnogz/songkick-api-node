# songkick-api-node
A full-fledged Songkick API wrapper/enhancer for Node.js.

## Overview
The Songkick API limits requests to a single page with 50 results.
This library adds the ability to fetch all results in a single call as well increase the page size above 50.
All requests to this library will return a promise.

## Usage
You will first to request a Songkick API key before using this library.
Once obtained, simply require this library and instantiate.

```
  const Songkick = require('songkick-api-node');
  const songkickApi = new Songkick('YourApiKey');
```

## API Documentation

Coming Soon!

### Calendars
- Artist
- Venue
- Metro Area
- User

### Search
- Event 
- Artist
- Venue
- Location/Metro Area