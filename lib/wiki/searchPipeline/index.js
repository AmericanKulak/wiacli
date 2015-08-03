//==================================================================================================
// SearchPipeline serves as the search and result sorter for the wiki.
//==================================================================================================
// Searches the index, and returns a list of pages that the current user can see, sorted according
// to their match ranking.
module.exports.search = search;
//============================= Public API Implementation ==========================================
function search(query, user) {
  var searchResults  = index.search(query);
  var mappedResults  = mapSearchResultsToWeightedParagraphList(searchResults);
  var filteredByACL  = filterWeightedParagraphByACL(mappedResults, user);
  var pageResults    = reduceWeightedListToPages(filteredByACL);
  var sortedResults  = sortPageResults(pageResults);
  var pagesToDisplay = mapPageResultsToDisplayPages(sortedResults);
  return pagesToDisplay;
}
//============================= Private API ========================================================
var PageStore = require('../stores/pageStore');

var index = require('lunr')(function() {
  this.field('text');
  this.field('sectionText', {boost: 5});
  this.field('pageText', {boost: 10});
  this.ref('id');
});

console.log('Seeding in-memory index with pageStore seed.');
var paragraphsToSeed = PageStore.getAllParagraphs();
for (var i = 0; i < paragraphsToSeed.length; i++) {
  index.add(paragraphsToSeed[i]);
};

function mapSearchResultsToWeightedParagraphList(searchResults) {
  return searchResults.map(function(currentValue, index, array) {
    return {
      'weight': currentValue.score,
      'paragraph': PageStore.getParagraphById(currentValue.ref)
    };
  });
}

function filterWeightedParagraphByACL(weightedResults, user) {
  return weightedResults.filter(function(element, index, array) {
    return element.paragraph.isPublic || user.canView(element.paragraph.infoKey)
  });
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
  return pageResults;
}

function mapPageResultsToDisplayPages(pageResults) {
  return pageResults.map(function(currentValue, index, array){
    return PageStore.getPageById(currentValue.pageId);
  });
}
