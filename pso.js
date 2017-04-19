var algoliasearch = require('algoliasearch'); //'./pso'
var client = algoliasearch('L639T95U5A', 'ac3763ef1cc0fea7a42ae6877e628ca2');
var index = client.initIndex('highered_prod_products');
var dataArray = []
var searchIndex = function(query, attributeKey, attributeValue) {




  if (!attributeKey){
index.search(query, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(content.nbHits + " hits")
   for (var h in content) {

    console.log(content[h][0]);
   }

})
  }
  else {

    index.search({
  query: "",
  filters: ''// attributeKey + ':' + attributeValue
}).then(res => {
      console.log(res)
  for (var hit in res.hits ){
    dataArray.push(res.hits[hit].attributes.metaTitle)
  }
      console.log(dataArray)
});
/*
// with params
index.search(query, {
  attributesToRetrieve: [attributes],
  hitsPerPage: 50
}, function searchDone(err, content) {
  if (err) {
    console.error(err);
    return;
  }

  for (var h in content.hits) {
    console.log('Hit(' + content.hits[h].objectID + '): ' + content.hits[h].toString());
  }*/

}

  };

module.exports = searchIndex
