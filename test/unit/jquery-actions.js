modal("use jQuery built-in actions");

QUnit.test("jQuery hide modal", function(assert) {
  expect(1);
  var $modal = $.d_modal("Hello, World.", { parent: "#qunit-fixture" });
  $modal.hide();
  ok($modal.is(":hidden"), "Modal was hidden");
});

QUnit.test("jQuery hide blocking modal", function(assert) {
  expect(1);
});

QUnit.test("jQuery hide hidden modal (no action)", function(assert) {
  expect(0);
});

QUnit.test("jQuery show hidden modal", function(assert) {
  expect(2);
  var $modal = $('<div style="display:none;">Hello</div>')
                   .appendTo("#qunit-fixture")
                   .d_modal()
                   .hide();
  ok($modal.is(":hidden"), "Modal is hidden before show");
  $modal.show();
  ok(!$modal.is(":hidden"), "Modal is visible after show");
});

QUnit.test("jQuery remove modal", function(assert) {
  expect(1);
});

QUnit.test("jQuery remove blocking modal", function(assert) {
  expect(1);
});

QUnit.test("jQuery remove hidden modal", function(assert) {
  expect(1);
});