Template.placeEditModal.rendered = function () {
  $('#placeForm').submit(function () {
    if (AutoForm.validateForm('placeForm')) Modal.hide('placeEditModal');
  });
};

Template.placeAddModal.rendered = function () {
  $('#placeAdd').submit(function () {
    if (AutoForm.validateForm('placeForm')) Modal.hide('placeAddModal');
  });
};