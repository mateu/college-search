var csv = require('csv')
  , elasticsearch  = require('elasticsearch');

var clientArgs = { host: 'localhost:9200' };
var client = new elasticsearch.Client(clientArgs);
csv()
.from.path(__dirname+'/data/hd2012.csv', { 
  delimiter: ',', 
  escape: '"',
  columns: true
} )
.to.array( function(data){
  data.forEach(function(row) {
    client.index({
      index: 'ipeds',
      type:  'college',
      body: row
    }, function (error, response) {

    });    
  });
} ); 
  
