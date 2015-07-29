module.exports.search = searchPipeline;

var PageStore = require('../pageStore');

// Index Setup
var index = require('lunr')(function() {
  this.field('text');
  this.field('sectionText', {boost: 5});
  this.field('pageText', {boost: 10});
  this.ref('id');
});


console.log('Seeding index with pageStore seed.');
var paragraphsToSeed = PageStore.getAllParagraphs();
for (var i = 0; i < paragraphsToSeed.length; i++) {
  index.add(paragraphsToSeed[i]);
};


function searchPipeline(query) {
  var searchResults = search(query);
  var mappedResults = mapSearchResultsToWeightedParagraphList(searchResults);
  var filteredByACL = filterWeightedParagraphByACL(mappedResults);
  var pageResults   = reduceWeightedListToPages(filteredByACL);
  sortPageResults(pageResults);
  var pagesToDisplay = mapPageResultsToDisplayPages(pageResults);
  return pagesToDisplay;
}



function search(query) {
  var results = index.search(query);
  // console.log(results);
  return results;
}

function mapSearchResultsToWeightedParagraphList(searchResults) {
  return searchResults.map(function(currentValue, index, array) {
    return {
      'weight': currentValue.score,
      'paragraph': PageStore.getParagraphById(currentValue.ref)
    };
  });
}

function filterWeightedParagraphByACL(weightedResults) {
  // TODO(khumphrey): Implement.
  return weightedResults;
}

function reduceWeightedListToPages(weightedResults) {
  var pageResults = [];
  var pageDictionary = {};

  weightedResults.forEach(function(currentValue, index, array) {
    var pageId = currentValue.paragraph.id.split('-')[0];
    if (pageDictionary[pageId]) {
      pageDictionary[pageId].weight += currentValue.weight;
    } else {
      pageDictionary[pageId] = {
        'pageId': pageId,
        'weight': currentValue.weight
      };
    }
  });

  for (pageId in pageDictionary) {
    pageResults.push(pageDictionary[pageId]);
  }

  return pageResults;
}

function sortPageResults(pageResults) {
  pageResults.sort(function(a, b){
    if (a.weight < b.weight) {
      return -1;
    }
    if (b.weight > a.weight) {
      return 1;
    }
    return 0;
  });
}

function mapPageResultsToDisplayPages(pageResults) {
  return pageResults.map(function(currentValue, index, array){
    return PageStore.getPageById(currentValue.pageId);
  });
}


