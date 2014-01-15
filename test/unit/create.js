QUnit.test("Creation of modal", function(assert) {
  expect(5);
  var $modal = $.d_modal("Hello, World", { parent: "#qunit-fixture" });
  equal($modal.parent().attr("id"), "qunit-fixture", "Modal is placed within fixture");
  ok($modal.hasClass("d-modal"), "Modal created with d-modal class");
  ok(!$modal.is(":hidden"), "Modal is visible");
  equal($modal.offset().top,0, "Modal is placed at top");
  equal($modal.find(".dismiss").length,1, "Modal has exactly one dismiss button");
  $modal.remove();
});

QUnit.test("Create modal from existing div", function(assert) {
  expect(4);
  var $modal = $("<div>Hello, World</div>").appendTo("#qunit-fixture").d_modal();
  ok($modal.hasClass("d-modal"), "Modal received d-modal class");
  equal($modal.offset().top,0, "Modal is placed at top");
  equal($modal.find(".dismiss").length,1, "Modal has exactly one dismiss button");
  $modal.remove();
});

QUnit.test("Creation of eternal modal", function(assert) {
  expect(1);
  var $modal = $.d_modal("Hello, World", {
    dismissable: false,
    parent: "#qunit-fixture"
  });
  ok($modal.hasClass("d-modal"), "Has d-modal class");
  ok($modal.hasClass("d-modal-eternal"), "Has d-modal-eternal class");
  $modal.remove();
});

QUnit.test("Creation of blocking modal", function(assert) {
  expect(1);
});

QUnit.test("Creation of two modals", function(assert) {
  expect(1);
});