var Identity = require('./lib/identity');
var PageRenderer = require('./lib/pageRenderer');
var SearchPipeline = require('./lib/searchPipeline');

function main() {
  var kSearchTerm = 'head';
  var currentUser, pagesToShow;

  console.log('\r\nSearching for "'+ kSearchTerm + '".\r\n')

  console.log('Player one, no access to resource with search term.');
  currentUser = Identity.getUserById('PlayerOne');
  pagesToShow = SearchPipeline.search(kSearchTerm, currentUser);
  renderPages(pagesToShow, currentUser);

  console.log('\r\n==================\r\n');

  console.log('Player two, specific access to resource with search term.');
  currentUser = Identity.getUserById('PlayerTwo');
  pagesToShow = SearchPipeline.search(kSearchTerm, currentUser);
  renderPages(pagesToShow, currentUser);

  console.log('\r\n==================\r\n');

  console.log('A fate, access to all resources.');
  currentUser = Identity.getUserById('Fate');
  pagesToShow = SearchPipeline.search(kSearchTerm, currentUser);
  renderPages(pagesToShow, currentUser);
}

function renderPages(pages, user) {
  for (var i = 0; i < pages.length; i++) {
    printPage(PageRenderer.renderPage(pages[i], user));
  };
}

function printPage(object) {
  console.log(JSON.stringify(object, ['title', 'sections', 'header', 'paragraphs', 'text'], 2));
}

main();
