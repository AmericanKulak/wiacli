var router = require('express').Router();

router.get('/', function(req, res) {
  res.logAndRender('wiki_home',  {'whee':'The wiki home page!'});
});

router.get('/search', function(req, res) {
  res.logAndRender('wiki_search', {'query': req.query.q});
});

router.get('/page/:id', function(req, res) {
  res.logAndRender('wiki_page', {'page_id': req.params.id})
});

router.post('/page/:pageId/editParagraph/:paragraphId', function(req, res) {
  req.body;
});

router.post('/page', function(req, res) {
  req.body;
})

module.exports = router;