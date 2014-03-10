var csv = require('csv')
  , nconf = require('nconf')
  , elasticsearch  = require('elasticsearch');

nconf
.argv()
.env()
.file({ file: './config.json'})
.file({ file: './config_local.json'});

//Allow env names for nested values
nconf.env('__');

var clientArgs = { 
  hosts: nconf.get('es:hosts'),
  keepAlive: false
};
var client = new elasticsearch.Client(clientArgs);

var bulk_body = [];
csv()
.from.path(__dirname+'/data/hd2012.csv', { 
  delimiter: ',', 
  escape: '"',
  columns: true
} )
.on('record', function(row, index){
  bulk_body.push(
    { index: { _index: 'ipeds', _type: 'college', _id: row.UNITID } },
    row
  );
})
.on('end', function(count){
  console.log('Indexing '+count+' records');
  client.bulk({
    body: bulk_body 
  }, function (error, response) {
    if(error) {
      console.log('Indexing Error:'+error.message);
    }
    else {
        console.log("Done Indexing");
    }
  });
})
.on('error', function(error){
  console.log('CSV Parsing Error:'+error.message);
});
