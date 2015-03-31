
// custom dev for navigation
var btnToggle = document.getElementById('btn-open-toggle');
var menuToggle = document.getElementById('menu-toggle');
btnToggle.onclick = function() {
  toggleClass(menuToggle, 'on');
  return false;
};

var linkServices = document.getElementById('link-services');
linkServices.onclick = function() {
  toggleClass(menuToggle, 'on');
  return true;
};

var linkContact = document.getElementById('link-contactus');
linkContact.onclick = function() {
  toggleClass(menuToggle, 'on');
  return true;
};

var linkValues = document.getElementById('link-values');
linkValues.onclick = function() {
  toggleClass(menuToggle, 'on');
  return true;
};
