var express = require('express')
  , cons = require('consolidate')
  , elasticsearch = require('elasticsearch')
  , path = require('path');

var app = express();

app.engine('hjs', cons.hogan);
app.set("views", __dirname + "/views");
app.set('view engine', 'hjs');
app.use(express.static(path.join(__dirname, 'public')));

var client = new elasticsearch.Client({
    host: 'huntana.com:9200'
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

var port = 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


// Helper functions
function transform(hit) {
    // Format Score
    hit._score = hit._score.toFixed(2);
    return hit;
}