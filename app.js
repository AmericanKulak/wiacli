var WikiPage = require('./lib/wikiPage').Page;

function main() {
  seed();
  var searchResults = search('Cat');
  var mappedResults = mapSearchResultsToWeightedParagraphList(searchResults);
  var filteredByACL = filterWeightedParagraphByACL(mappedResults);
  var pageResults   = reduceWeightedListToPages(filteredByACL);
  sortPageResults(pageResults);
  var pagesToDisplay = mapPageResultsToDisplayPages(pageResults);

  console.dir(pagesToDisplay);
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
      'paragraph': getParagraphById(currentValue.ref)
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
    return myPages[currentValue.pageId];
  });
}


// Index Setup
var index = require('lunr')(function() {
  this.field('text');
  this.field('sectionText', {boost: 5});
  this.field('pageText', {boost: 10});
  this.ref('id');
});



var myPages = [];

function getParagraphById(fullAddressId) {
  var pageId = fullAddressId.split('-')[0];
  var sectionId = fullAddressId.split('-')[1];
  var paragraphId = fullAddressId.split('-')[2];

  return myPages[pageId].sections[sectionId].paragraphs[paragraphId];
}

function seed() {
  var dogPage = new WikiPage("Dogs");
  var breedSection = dogPage.addSectionWithHeader("Breeds");
  breedSection.addParagraphWithText("Crazy Pomeranions");
  breedSection.addParagraphWithText("Crazy Rascals");
  breedSection.addParagraphWithText("Fine Rascals");
  myPages.push(dogPage);

  var catPage = new WikiPage("Cats");
  var breedSection = catPage.addSectionWithHeader("Breeds");
  var careSection = catPage.addSectionWithHeader("Care");
  breedSection.addParagraphWithText("Sleek longhairs");
  breedSection.addParagraphWithText("Ruffled grumpycats");
  breedSection.addParagraphWithText("Crazy siamese");
  careSection.addParagraphWithText("Lots of head scratchies");
  myPages.push(catPage);

  var myParagraphs = [];
  for (var i = 0; i < myPages.length; i++) {
    myParagraphs = myParagraphs.concat(myPages[i].standaloneParagraphs());
  }
  console.dir(myParagraphs)
  console.log('Seeding index with myPages seed.');
  for (var i = 0; i < myParagraphs.length; i++) {
    index.add(myParagraphs[i]);
  };
}



main();
