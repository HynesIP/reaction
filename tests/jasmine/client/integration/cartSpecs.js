/* Product Detail Page Specs*/
describe("Cart", function () {
  beforeEach(function (done) {
    ReactionRouter.go("product", {handle: "example-product"});
    Tracker.afterFlush(done);
  });

  // add to cart from pdp
  describe("Add to cart", function () {
    // empty cart items before each test
    afterEach(function (done) {
      const cart = ReactionCore.Collections.Cart.findOne();
      // we manually remove all items from cart
      cart.items && cart.items.forEach((item) => {
        Meteor.call("cart/removeFromCart", cart._id, item);
        // todo update to the next after apllying PR #613
        // Meteor.call("cart/removeFromCart", item._id);
      });

      done();
    });

    it("should not add to cart without option selected", function () {
      // no option is selected yet
      $("#add-to-cart").trigger("click");
      // check alert
      expect($("#product-alerts div:first-child").text()).not.toBeNull();
    });

    it("should add selected option to cart", function (done) {
      let option1 = $(".variant-product-options .variant-select-option")[0];
      let addToCartButton = $("#add-to-cart");
      // needs client stubs
      /* let spyOnCart = spyOn(ReactionCore.Collections.Cart, "update").and.returnValue();*/

      let spyOnOptionEvent = spyOnEvent(option1, "click");
      let spyOnAddToCartEvent = spyOnEvent(addToCartButton, "click");

      $(option1).trigger("click");

      expect("click").toHaveBeenTriggeredOn(option1);
      expect(spyOnOptionEvent).toHaveBeenTriggered();

      $(addToCartButton).trigger("click");
      expect(spyOnAddToCartEvent).toHaveBeenTriggered();
      /* expect(spyOnCart).toHaveBeenCalled(); */
      done();
    });

    it("should let the quantity for selected option be changed", function () {
      let option1 = $(".variant-product-options .variant-select-option")[0];
      let addToCartButton = $("#add-to-cart");

      let spyOnOptionEvent = spyOnEvent(option1, "click");
      let spyOnAddToCartEvent = spyOnEvent(addToCartButton, "click");

      $("#add-to-cart-quantity").val(22);
      $(option1).trigger("click");

      expect("click").toHaveBeenTriggeredOn(option1);
      expect(spyOnOptionEvent).toHaveBeenTriggered();

      $(addToCartButton).trigger("click");
      expect(spyOnAddToCartEvent).toHaveBeenTriggered();
    });

    it("should throw an error if not enough quantity", function () {
      let option1 = $(".variant-product-options .variant-select-option")[0];
      let addToCartButton = $("#add-to-cart");
      let cartCount = $(".cart-icon .badge").text();

      let spyOnOptionEvent = spyOnEvent(option1, "click");
      let spyOnAddToCartEvent = spyOnEvent(addToCartButton, "click");

      $("#add-to-cart-quantity").val(2002);
      $(option1).trigger("click");

      expect("click").toHaveBeenTriggeredOn(option1);
      expect(spyOnOptionEvent).toHaveBeenTriggered();

      $(addToCartButton).trigger("click");
      expect(spyOnAddToCartEvent).toHaveBeenTriggered();

      expect($(".cart-icon .badge").text()).toEqual(cartCount);
    });
  });

  // checkout from pdp
  describe("Checkout", function () {
    it("should not add to cart without variant/option selected", function () {
      // no option is selected yet
      $("#add-to-cart").trigger("click");
      // check alert
      expect($("#product-alerts div:first-child").text()).not.toBeNull();
    });

    it("should add selected option to cart", function () {
      let option1 = $(".variant-product-options .variant-select-option")[0];
      let addToCartButton = $("#add-to-cart")[0];
      let spyOnOptionEvent = spyOnEvent(option1, "click");
      let spyOnAddToCartEvent = spyOnEvent(addToCartButton, "click");

      $(option1).trigger("click");

      expect("click").toHaveBeenTriggeredOn(option1);
      expect(spyOnOptionEvent).toHaveBeenTriggered();

      $(addToCartButton).trigger("click");
      expect(spyOnAddToCartEvent).toHaveBeenTriggered();
    });

    it("should goto checkout when checkout button clicked ", function (done) {
      let btnCheckout = $("#btn-checkout");
      let cartIcon = $(".cart-icon");

      let spyOnCheckoutButton = spyOnEvent(btnCheckout, "click");
      let spyOnCartIcon = spyOnEvent(cartIcon, "click");

      $(cartIcon).trigger("click");
      expect(spyOnCartIcon).toHaveBeenTriggered();

      $("#btn-checkout").trigger("click");
      expect(spyOnCheckoutButton).toHaveBeenTriggered();
      expect(ReactionRouter.current().route.path).toEqual("cart/checkout");
      done();
    });
  });
});
