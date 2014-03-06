# A tiny college search application.

## Load (index) data

  node csv.js

## Start app

  node app.js

## Search by college name:

  http://localhost:5000/Texas

## Notes

### Slow indexing over WAN

elasticsearch indexing (csv.js) over to a remote docker container (think ping ~ 120ms) 
required me increasing the requestTimeout (to 100 seconds from 30 seconds) for the 
indexing to complete.
