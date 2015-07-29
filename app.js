var SearchPipeline = require('./lib/searchPipeline');

function main() {
  var pagesToShow = SearchPipeline.search('cat');
  console.log(pagesToShow);
}

main();
