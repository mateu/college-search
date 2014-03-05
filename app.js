var express = require('express')
  , cons = require('consolidate')
  , elasticsearch = require('elasticsearch')
  , nconf = require('nconf')
  , path = require('path');

nconf.file({ file: 'config.json'});
nconf.file({ file: 'config_local.json'});
nconf.argv().env();
nconf.defaults({
  'http': {'port': 5000},
  'es': {'hosts': ['huntana.com:9200']}
});
// Allow env names for nested values
nconf.env('__');

var app = express();

app.engine('hjs', cons.hogan);
app.set("views", __dirname + "/views");
app.set('view engine', 'hjs');
app.use(express.static(path.join(__dirname, 'public')));

var client = new elasticsearch.Client({
    hosts: nconf.get('es:hosts')
}); 

app.get('/:search_query', function(request, response) {
  client.search({
    index: 'ipeds',
    size: 100,
    body: {
      query: {
        match: {
          INSTNM: request.param('search_query')
        }
      }
    },
  }, function (error, search_response) {
    if (error) {
      console.log('I wet myself: ' + error);
      return;
    }
    var hits_transformed = [];
    var hits = search_response.hits.hits;    
    hits.forEach(function(hit) {
      hits_transformed.push(transform(hit));
    });
    response.render('results', {
      results: hits_transformed,
      query:  request.param('search_query'),
    });
  });
});

var port = nconf.get('http:port');
app.listen(port, function() {
  console.log("Listening on " + port);
});


// Helper functions
function transform(hit) {
    // Format Score
    hit._score = hit._score.toFixed(2);
    return hit;
}
