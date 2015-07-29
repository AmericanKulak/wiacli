//==================================================================================================
// PageStore is a data accessor for WikiPage objects. PageStore is a singleton, and thus anybody who
// requires PageStore will get the same instance (I hope).
//==================================================================================================
// Gets a specific paragraph by a fully qualified id.
module.exports.getParagraphById = getParagraphById;
// Gets an array of all paragraphs as stand-alones. Includes information from pages/sections.
module.exports.getAllParagraphs = getAllParagraphs;
// Gets a specific page by it's Id.
module.exports.getPageById = getPageById;

//============================= Public API Implementation ==========================================
function getParagraphById(fullAddressId) {
  var pageId = fullAddressId.split('-')[0];
  var sectionId = fullAddressId.split('-')[1];
  var paragraphId = fullAddressId.split('-')[2];

  return myPages[pageId].sections[sectionId].paragraphs[paragraphId];
}

function getAllParagraphs() {
  var myParagraphs = [];
  for (var i = 0; i < myPages.length; i++) {
    myParagraphs = myParagraphs.concat(myPages[i].standaloneParagraphs());
  }
  return myParagraphs;
}

function getPageById(pageId) {
  return myPages[pageId]
}

//============================= Private API ========================================================
var WikiPage = require('../wikiPage').Page;

// Database
var myPages = [];
// Sets up fake information.
function seed() {
  console.log('Setting up fake pageStore.');
  var dogPage = new WikiPage('Dogs');
  var breedSection = dogPage.addSectionWithHeader('Breeds');
  breedSection.addParagraphWithText('Crazy Pomeranions');
  breedSection.addParagraphWithText('Crazy Rascals');
  breedSection.addParagraphWithText('Fine Rascals');
  myPages.push(dogPage);

  var catPage = new WikiPage('Cats');
  var breedSection = catPage.addSectionWithHeader('Breeds');
  var careSection = catPage.addSectionWithHeader('Care');
  breedSection.addParagraphWithText('Sleek longhairs');
  breedSection.addParagraphWithText('Ruffled grumpycats');
  breedSection.addParagraphWithText('Crazy siamese');
  careSection.addParagraphWithText('Lots of head scratchies');
  myPages.push(catPage);
}
seed();
