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
    host: 'localhost:9200'
}); 

app.get('/:search_query', function(request, response) {
  client.search({
    index: 'ipeds',
    body: {
      query: {
        match: {
          INSTNM: request.param('search_query')
        }
      }
    },
//    fields: ['INSTNM', 'CITY', 'STABBR', 'WEBADDR']
  }, function (error, search_response) {
    if (error) {
      // handle error
      console.log('I wet myself: ' + error);
      return;
    }
    response.render('results', {
      results: search_response.hits.hits,
      query:  request.param('search_query'),
    });
  });
});

var port = 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
