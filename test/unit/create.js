QUnit.test("Creation of modal", function(assert) {
  expect(3);
  var $modal = $.d_modal("Hello, World");
  ok($modal.hasClass("d-modal"), "Modal created with d-modal class");
  ok(!$modal.is(":hidden"), "Modal is visible");
  equal($modal.offset().top,0, "Modal is placed at top");
  $modal.remove();
});

QUnit.test("Creation of eternal modal", function(assert) {
  expect(1);
  var $modal = $.d_modal("Hello, World", {
    dismissable: false
  });
  ok($modal.hasClass("d-modal"), "Has d-modal class");
  ok($modal.hasClass("d-modal-eternal"), "Has d-modal-eternal class");
});

QUnit.test("Creation of blocking modal", function(assert) {
  expect(1);
});

QUnit.test("Creation of two modals", function(assert) {
  expect(1);
});