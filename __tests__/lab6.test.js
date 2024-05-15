describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/Lab6_Part1_Starter/');
  }, 20000);

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;
    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });
    console.log(`Checking product item 1/${prodItemsData.length}`);
    // Make sure the title, price, and image are populated in the JSON
    firstValue = prodItemsData[0];
    if (firstValue.title.length == 0) { allArePopulated = false; }
    if (firstValue.price.length == 0) { allArePopulated = false; }
    if (firstValue.image.length == 0) { allArePopulated = false; }
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    // TODO - Step 1
    // Right now this function is only checking the first <product-item> it found, make it so that
    // it checks every <product-item> it found
    for(let i = 0; i < prodItemsData.length; i++){
        currValue = prodItemsData[i];
        if (currValue.title.length == 0) { allArePopulated = false; }
        if (currValue.price.length == 0) { allArePopulated = false; }
        if (currValue.image.length == 0) { allArePopulated = false; }

        expect(allArePopulated).toBe(true);
    }
  }, 10000);

  it('Make sure <product-item> elements are populated', async () => {
    const allArePopulated = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const data = item.data;
        return data && data.title && data.title.length > 0 && 
               data.price && data.price > 0 && 
               data.image && data.image.length > 0;
      });
    });
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    // TODO - Step 2
    // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
    // Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
    // Once you have the button, you can click it and check the innerText property of the button.
    // Once you have the innerText property, use innerText.jsonValue() to get the text value of it

    const theItem = await page.$('product-item');
    // console.log('This is theItem: ' + theItem);
    const shadRoot = await page.evaluateHandle(e => e.shadowRoot, theItem);
    // console.log('This is shadRoot: ' + shadRoot);
    const queryButton = await shadRoot.$('button');
    // console.log('This is queryButton: ' + queryButton)
    await queryButton.click();
    const buttonText = await page.evaluateHandle(e => e.innerText, queryButton);
    // console.log('This is buttonText: ' + buttonText);
    const jsonText = await buttonText.jsonValue();    // note to self: put "await" otherwise this is returned as a "Promise"
    // console.log(jsonText);

    expect(jsonText).toBe('Remove from Cart');
    
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 3
    // Query select all of the <product-item> elements, then for every single product element
    // get the shadowRoot and query select the button inside, and click on it.
    // Check to see if the innerText of #cart-count is 20
    const allItems = await page.$$('product-item');
    const cart = await page.$('#cart-count');

    // console.log('This is cart: ' + cart);
    let cartCount;
    for(let i = 0; i < allItems.length; i++){
      const shadRoot = await page.evaluateHandle(e => e.shadowRoot, allItems[i]);
      const queryButton = await shadRoot.$('button');
      await queryButton.click();

      // Added this section to make sure all buttons are clicked
      // For some reason the first button was getting clicked twice, so one item ended up not being added to cart
      // Just realized it's clicked twice because the previous test clicks it (keeping this here to remind myself)

      const buttonText = await page.evaluateHandle(e => e.innerText, queryButton);
      const jsonButtonText = await buttonText.jsonValue();
      if(jsonButtonText == "Remove from Cart"){
        continue;
      } else{
        await queryButton.click();
      }
    }
    cartCount = await cart.getProperty('innerText');
    // console.log('This is cartCount: ' + cartCount);
    const jsonCartCount = await cartCount.jsonValue();
    expect(jsonCartCount).toBe("20");
  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 4
    // Reload the page, then select all of the <product-item> elements, and check every
    // element to make sure that all of their buttons say "Remove from Cart".
    // Also check to make sure that #cart-count is still 20
    const reloadPage = await page.reload();
    const allItems = await page.$$('product-item');

    const cart = await page.$('#cart-count');
    let bool = true;                                                              // true if all buttons are 'remove...' and count still 20

    for(let i = 0; i < allItems.length; i++){
      const shadRoot = await page.evaluateHandle(e => e.shadowRoot, allItems[i]); // Get shadowroot of item
      const queryButton = await shadRoot.$('button');                             // Get the button
      const buttonText = await page.evaluateHandle(e => e.innerText, queryButton);// Get inner text of button
      const jsonButtonText = await buttonText.jsonValue();                        // json value of inner text
      if(jsonButtonText == "Remove from Cart"){
        continue;
      } else{
        bool = false;
      }
    }
    const cartCount = await cart.getProperty('innerText');
    const jsonCartCount = await cartCount.jsonValue();                            // Check #cart-count still 20
    if (jsonCartCount != '20'){
      bool = false;
    }

    expect(bool).toBe(true);
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    // TODO - Step 5
    // At this point he item 'cart' in localStorage should be 
    // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is

    const localCart = await page.evaluate(() => {
      return localStorage.getItem('cart');  
    });
    // console.log('This is localCart: ' + localCart);

    let bool = true;
    if(localCart == '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'){
      bool = true;
    } else {
      bool = false;
    }

    expect(bool).toBe(true);
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 6
    // Go through and click "Remove from Cart" on every single <product-item>, just like above.
    // Once you have, check to make sure that #cart-count is now 0
    const allItems = await page.$$('product-item');
    const cart = await page.$('#cart-count');

    let cartCount;
    let bool = true;
    for(let i = 0; i < allItems.length; i++){
      const shadRoot = await page.evaluateHandle(e => e.shadowRoot, allItems[i]);
      const queryButton = await shadRoot.$('button');
      await queryButton.click();      
    }
    cartCount = await cart.getProperty('innerText');  // Get #cart-count value

    const jsonCartCount = await cartCount.jsonValue();
    if(jsonCartCount != '0'){
      bool = false;
    }
    
    expect(bool).toBe(true);

  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 7
    // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
    // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
    // Also check to make sure that #cart-count is still 0
    await page.reload();
    const allItems = await page.$$('product-item');
    const cart = await page.$('#cart-count');

    let bool = true;
    for(let i = 0; i < allItems.length; i++){
      const shadRoot = await page.evaluateHandle(e => e.shadowRoot, allItems[i]);
      const queryButton = await shadRoot.$('button');
      const buttonText = await page.evaluateHandle(e => e.innerText, queryButton);
      const jsonButtonText = await buttonText.jsonValue();
      
      // Checks to make sure all buttons are on "Add to Cart"
      if(jsonButtonText == "Add to Cart"){
        continue;
      } else{
        bool = false;
      }
    }
    
    // Get cart count value
    const cartCount = await cart.getProperty('innerText');
    const jsonCartCount = await cartCount.jsonValue();
    // Make sure cart count value is still 0, false otherwise
    if(jsonCartCount != '0'){
      bool = false;
    }

    expect(bool).toBe(true);

  }, 20000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    // TODO - Step 8
    // At this point he item 'cart' in localStorage should be '[]', check to make sure it is

    const localCart = await page.evaluate(() => {
      return localStorage.getItem('cart');  
    });

    let bool = true;
    if(localCart == '[]'){
      bool = true;
    } else {
      bool = false;
    }

    expect(bool).toBe(true);
  });
});
