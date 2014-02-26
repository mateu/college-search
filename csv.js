var fs  = require('fs')
  , csv = require('csv')
  , elasticsearch  = require('elasticsearch');

var  client = new elasticsearch.Client();
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
  
