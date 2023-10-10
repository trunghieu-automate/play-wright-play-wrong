Test case 1: Verify that the home page loads correctly and displays the products.

Navigate to the home page
Expect the page title to be “React Shopping Cart”.
Expect the page to have a header with the logo and the cart icon.
Expect the page to have a main section with a list of products.
Expect each product to have an image, a name, a price, and an add to cart button.
Test case 2: Verify that the user can add a product to the cart and view the cart details.

Navigate to the home page
Click on the add to cart button of the first product.
Expect a toast message to appear with the text “Product added to cart”.
Click on the cart icon in the header.
Expect the cart modal to open and display the product details, such as name, price, quantity, and subtotal.
Expect the cart modal to also display the total amount and a checkout button.
Test case 3: Verify that the user can remove a product from the cart and update the cart details.

Navigate to the home page 
Click on the add to cart button of the first product.
Click on the add to cart button of the second product.
Click on the cart icon in the header.
Expect the cart modal to open and display two products with their details.
Click on the remove button of the first product.
Expect the first product to be removed from the cart modal and the toast message to appear with the text “Product removed from cart”.
Expect the cart modal to update the total amount and display only one product.
Test case 4: Verify that the user can checkout and complete an order with a valid credit card.

Navigate to the home page
Click on the add to cart button of any product.
Click on the cart icon in the header.
Click on the checkout button in the cart modal.
Expect to be redirected to a checkout page with a form for entering shipping and billing information.
Fill in valid shipping and billing information, such as name, address, email, phone number, etc.
Fill in a valid credit card number, such as 4242 4242 4242 4242, with any expiration date and CVV code.
Click on the place order button at the bottom of the form.
Expect to be redirected to a confirmation page with a thank you message and an order summary.