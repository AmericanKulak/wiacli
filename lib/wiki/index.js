var router = require('express').Router();
var PageStore = require('./stores/pageStore');
var PageRenderer = require('./pageRenderer');

router.get('/', function(req, res) {
  res.logAndRender('wiki_home',  {'whee':'The wiki home page!'});
});

router.get('/search', function(req, res) {
  res.logAndRender('wiki_search', {'query': req.query.q});
});

router.get('/page/:page_id', function(req, res) {
  var page = PageStore.getPageById(req.params.page_id);
  var renderedPage = PageRenderer.renderPage(page, req.user)
  res.logAndRender('wiki_page', renderedPage);
});

router.post('/page/:pageId/editParagraph/:paragraphId', function(req, res) {
  req.body;
});

router.post('/page', function(req, res) {
  req.body;
})

module.exports = router;