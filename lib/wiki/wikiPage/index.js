var uniqueCounter = 0;
function uniqueKey() {
  return uniqueCounter++;
}

var Page = function(title) {
  this.id = uniqueKey();
  this.title = title || 'Default title';
  this.sections = [];
  this.sectionCounter = 0;
}

// It's important to build the paragraph Id as a subset of the pageId so that we can pull paragraph look ups as address lookups.
Page.prototype.uniqueSectionId = function() {
  return this.id + '-' + this.sectionCounter++;
}

Page.prototype.addSectionWithHeader = function(header) {
  var section = new Section(this.uniqueSectionId(), header);
  this.sections.push(section);
  return section;
}

Page.prototype.standaloneParagraphs = function() {
  return explodeSectionsIntoParagraphWithPage(this.sections, this);
}

Page.prototype.copy = function() {
  return JSON.parse(JSON.stringify(this));
}

var Section = function(id, header) {
  this.id = id;
  this.header = header;
  this.paragraphs = [];
  this.paragraphCounter = 0;
}

Section.prototype.uniquePageId = function() {
  return this.id + '-' + this.paragraphCounter++;
}

Section.prototype.addParagraphWithText = function(text) {
  var paragraph = new Paragraph(this.uniquePageId(), text)
  this.paragraphs.push(paragraph);
  return paragraph;
}

var Paragraph = function(id, text) {
  this.id = id;
  this.text = text;
  this.infoKey = id;
  this.isPublic = true;
}

Paragraph.prototype.copy = function() {
  return JSON.parse(JSON.stringify(this));
}

module.exports.Page = Page;

function explodeSectionsIntoParagraphWithPage(sections, page) {
  var sectionParagraphs = sections.map(function(currentValue, index, array) {
    return explodeParagraphsIntoParagraphsWithPageAndSection(currentValue.paragraphs, page, currentValue);
  })
  return Array.prototype.concat.apply([], sectionParagraphs);
}

function explodeParagraphsIntoParagraphsWithPageAndSection(paragraphs, page, section) {
  return paragraphs.map(function(currentValue, index, array) {
    var paragraphCopy = currentValue.copy();
    paragraphCopy.pageId = page.id;
    paragraphCopy.sectionText = section.header;
    paragraphCopy.pageText = page.title;
    return paragraphCopy;
  });
}