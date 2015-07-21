function main() {
  seed()
  var searchResults = search('breed')
  var mappedResults = mapSearchResultsToWeightedParagraphList(searchResults)
  var filteredByACL = filterWeightedParagraphByACL(mappedResults)
  var pageResults   = reduceWeightedListToPages(filteredByACL)
  sortPageResults(pageResults)
  var pagesToDisplay = mapPageResultsToDisplayPages(pageResults)

  console.dir(pageResults);
}

function search(query) {
  var results = index.search(query);
  // console.log(results);
  return results
}

function mapSearchResultsToWeightedParagraphList(searchResults) {
  return searchResults.map(function(currentValue, index, array) {
    return {
      "weight": currentValue.score,
      "paragraph": getParagraphById(currentValue.ref)
    }
  })
}

function filterWeightedParagraphByACL(weightedResults) {
  // TODO(khumphrey): Implement.
  return weightedResults
}

function reduceWeightedListToPages(weightedResults) {
  var pageResults = []
  var pageDictionary = {}

  weightedResults.forEach(function(currentValue, index, array) {
    var pageId = currentValue.paragraph.id.split("-")[0]
    if (pageDictionary[pageId]) {
      pageDictionary[pageId].weight += currentValue.weight
    } else {
      pageDictionary[pageId] = {
        'pageId': pageId,
        'weight': currentValue.weight
      }
    }
  })

  for (pageId in pageDictionary) {
    pageResults.push(pageDictionary[pageId])
  }

  return pageResults
}

function sortPageResults(pageResults) {
  pageResults.sort(function(a, b){
    if (a.weight < b.weight) {
      return -1;
    }
    if (b.weight > a.weight) {
      return 1;
    }
    return 0
  })
}

function mapPageResultsToDisplayPages(pageResults) {
  return pageResults.map(function(currentValue, index, array){
    return myPages[currentValue.pageId]
  })
}


// Index Setup
var index = require("lunr")(function() {
  this.field('text')
  this.field('sectionText', {boost: 5})
  this.field('pageText', {boost: 10})
  this.ref('id')
});

// It's important to build the paragraph Id as a subset of the pageId so that we can pull paragraph look ups as address lookups.
var myPages = [
  {
    'id': '0',
    'title': 'Dogs',
    'sections': [
      {
        'id': '0-0',
        'title': 'Breeds',
        'paragraphs': [
          {
            'id': '0-0-0',
            'text': 'Crazy Pomeranions',
            'acl': []
          },
          {
            'id': '0-0-1',
            'text': 'Crazy Rascals',
            'acl': []
          },
          {
            'id': '0-0-2',
            'text': 'Fine Rascals',
            'acl': []
          }
        ]
      }
    ]
  }
]

function explodePagesIntoParagraphs(pages) {
  var pageParagraphs = pages.map(function(currentValue, index, array) {
    return explodeSectionsIntoParagraphWithPage(currentValue.sections, currentValue)
  })
  return Array.prototype.concat.apply([], pageParagraphs)
}

function explodeSectionsIntoParagraphWithPage(sections, page) {
  var sectionParagraphs = sections.map(function(currentValue, index, array) {
    return explodeParagraphsIntoParagraphsWithPageAndSection(currentValue.paragraphs, page, currentValue)
  })
  return Array.prototype.concat.apply([], sectionParagraphs)
}

function explodeParagraphsIntoParagraphsWithPageAndSection(paragraphs, page, section) {
  return paragraphs.map(function(currentValue, index, array) {
    return {
      'pageId': page.id,
      'id': currentValue.id,
      'acl': currentValue.acl,
      'text': currentValue.text,
      'sectionText': section.title,
      'pageText': page.title
    }
  })
}

function getParagraphById(fullAddressId) {
  var pageId = fullAddressId.split("-")[0]
  var sectionId = fullAddressId.split("-")[1]
  var paragraphId = fullAddressId.split("-")[2]

  return myPages[pageId].sections[sectionId].paragraphs[paragraphId]
}

function seed() {
  var myParagraphs = explodePagesIntoParagraphs(myPages)
  console.log('Seeding index with myPages seed.')
  for (var i = 0; i < myParagraphs.length; i++) {
    index.add(myParagraphs[i])
  };
}



main();
