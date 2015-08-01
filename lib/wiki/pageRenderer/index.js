//==================================================================================================
// PageRenderer isolates the parts of page that are renderable to the current user.
//==================================================================================================
module.exports.renderPage = renderPage;
//============================= Public API Implementation ==========================================
function renderPage(fullPage, user) {
  var dataModelForRendering = filterUnaccessibleSections(fullPage, user);
  dataModelForRendering.user = user;
  return dataModelForRendering;
}
//============================= Private API ========================================================
function filterUnaccessibleSections(fullPage, user) {
  fullPage.sections = fullPage.sections.map(function(currentValue, index, array) {
    currentValue.paragraphs = AccessibleParagraphsForSection(currentValue, user);
    return currentValue;
  }).filter(function(element, index, array) {
    // Remove sections that don't have any paragraphs remaining.
    return element.paragraphs.length > 0;
  });
  return fullPage;
}

function AccessibleParagraphsForSection(section, user) {
  return section.paragraphs.filter(function(element, index, array) {
    return element.isPublic || user.canView(element.infoKey);
  });
}