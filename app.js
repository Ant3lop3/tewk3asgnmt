//? FYI for further info on innerText & innerHTML look at my Study Book

//! setting the counts to 0:
// set the main variable cookie count to 0, same with the CPS:
let cookieCount = 0
let cookiePS = 0

//! Call loadProgress and displayShopItems when the page loads:
// window.onload is self-explainatory, when the webpage loads this function will do the following...
// please see further down about the creation of these functions
window.onload = function() {
    loadProgress();
    displayShopItems();
};


//! make variables & get the main elements that we created in the HTML doc:
const cookieMainDisplay = document.getElementById('cookieCount')
const cookiePSDisplay = document.getElementById('cookiePS')
const cookieButton = document.getElementById('cookieButton')
const shopContainer = document.getElementById('shopCont')

//! setting the cookie counter and using the cookie button:
function manageClick() {
    cookieCount += 1
    cookieMainDisplay.innerText= cookieCount
    // below saves each cookie click to our local storage as per our updateStorage function lower down:
    updateStorage()
}
cookieButton.addEventListener('click', manageClick)

//! setting the CPS counter and the main cookieCount so that the cookie counter goes up based on whatever the CPS is:
// setInterval is a function that repeatedly calls a function at a specified interval (in our case 1000 milisecs).
// Inside the interval function, cookieCount is increased by the value of cookiePS every second.
// If cookiePS is 1, cookieCount will increase by 1 every second; if cookiePS is 5, it will increase by 5 every second, and so on.
// we use innerText on the cookieCount to reflect the changes 
// This function call saves the current cookieCount and cookiePS values to local storage so that progress is saved... 
// and can be loaded later

setInterval(function() {
    cookieCount += cookiePS;  // Increment cookieCount by the current cookiePS value every second
    cookieMainDisplay.innerText = cookieCount;
    updateStorage();  // Save progress regularly
}, 1000);

//! fetching the shop items from the provided API link:
// we do async here as we are getting data from an external source. as JS can't do more than one thing at once
// we put in 'async' to basically say get back to this function once you've loaded the rest of the code up
// by using async it allows us to then use the keyword 'await'
async function getShop () {
    const shopInfo = await fetch(`https://cookie-upgrade-api.vercel.app/api/upgrades`)
    const shopItems = await shopInfo.json()
    return shopItems
}

//! visually setting up the shop items, ready for when create and use the 'displayShopItems()' function
//! IN ADDITION- adding buttons to the items (making the buttons functional is done in displayShopItems() function)

//? Step 1:
// this function will represent each object within the array thats in the API
// the parameter 'item' can be anyword, doesn't matter
function createShopItemElement(item) {

    //? Step 2:
    // Creates a new <div> element to hold all the item information.
    // Adds a CSS class 'shop-item' to this div for styling
    const shopItem = document.createElement('div')
    shopItem.classList.add('shop-item')

    //? Step 3:
    // Creates an <h3> element for the item's name.
    // Sets its text content to the name of the item.
    // Adds this name element as a child of the main shopItem div.
    const nameElement = document.createElement('h3')
    nameElement.innerText = item.name;
    shopItem.appendChild(nameElement)

    //? Step 4:
    // same as step 3 but for the cost initally however, further steps are needed:

    // 'Cost: ': This is a string literal that starts the text content.
    // +: This is the concatenation operator in JavaScript. It's used here to combine strings and other values.
    // item.cost: This accesses the cost property of the item object. For example, if item is {cost: 100}, then item.cost would be 100.
    // + ' cookies': This concatenates another string literal to the end.
    // So if item.cost is 100, the final string would be: "Cost: 100 cookies"
    const costElement = document.createElement('p')
    costElement.innerText = 'Cost: ' + item.cost + ' cookies'
    shopItem.appendChild(costElement)

    //? Step 5:
    // same as step 4
    const increaseElement = document.createElement('p')
    increaseElement.innerText = 'Increase: ' + item.increase + ' cookies per second'
    shopItem.appendChild(increaseElement)
    // be sure to return the shopItem function at the end after all the appending we did above:

    //? Step 6:
    // create the button element like we've done similar to the others above
    // edit the text of the button to 'Buy'
    // buybutton.id accesses the id property of the buyButton element, then we are assigning it the following:
    // `buy-${item.id}` is within ``called template literals, the equivalent in Python would be f-strings...
    // buy- is just a string. This: ${item.id} allows us to insert the value of the item.id property (click the API link...
    // to see the data. basically its the object id number)
    // finally we append as we've repeated many times above
    const buyButton = document.createElement('button')
    buyButton.innerText = 'Buy';
    buyButton.id = `buy-${item.id}`;
    shopItem.appendChild(buyButton)

    return shopItem
}

//! finally pulling in the shop items from the API and using the styling from 'createShopItemElement(item)' function
//! IN ADDITION- making the buyButton functional
// async explained above in getShop() function
// the variable shopContainer will be where all the shop items will be displayed
// Clear existing content, like we did in the photo gallery assignment, prevents duplication
// the var shopItems is going to be getting all items from the API, which needs an await as its externally sourced...
// (see getShop() function above)
// the shopItems.forEach(function(item)) goes through each item in the array
// next we're saying for each item in the array, call the createShopItemElement(item) function made eariler
// finally we then each item to the shopContainer var we made earlier which then displays the items

//? the buyButton:
// This selects the "Buy" button within the shop item element using its unique ID, which was set when the element was created... 
// The ID is generated based on the item's ID from the API (e.g., buy-2 for the item with ID 2).
// This sets up an event listener for the "Buy" button. When the button is clicked, the function inside this block is executed.
// if (cookieCount >= item.cost): This checks if the player has enough cookies to buy the item. The item can only be...
// purchased if cookieCount is greater than or equal to item.cost.
// cookieCount -= item.cost: If the player has enough cookies, the item's cost is subtracted from cookieCount.
// cookiePS += item.increase: The item's increase value (cookies per second) is added to cookiePS, increasing...
//  the rate at which cookies are generated.
// finally we save the progress by using the updateStorage() (as made earlier) and we the edit both counts using .innerText

async function displayShopItems() {
    const shopContainer = document.getElementById('shopCont');
    shopContainer.innerText = ''; 

    const shopItems = await getShop();
    shopItems.forEach(function(item) {
        const itemElement = createShopItemElement(item);
        shopContainer.appendChild(itemElement);

        const buyButton = document.getElementById(`buy-${item.id}`);
        buyButton.onclick = function() {
            if (cookieCount >= item.cost) {
                cookieCount -= item.cost;
                cookiePS += item.increase;
                updateStorage();
                cookieMainDisplay.innerText = cookieCount;
                cookiePSDisplay.innerText = cookiePS;
            }
        }
    });
}
displayShopItems()

//! saving current progress to users local storage:
// here we are simply setting the current counts to the local storage, we've called this function...
// within in the manageClick() function above, as we want to 'save' our progress very regulary on every click
function updateStorage() {
    localStorage.setItem('cookieCount', cookieCount)
    localStorage.setItem('cookiePS', cookiePS)
}



//! loading up data from the local storage to the current session:
//? Step 1:
// the if statement, this line checks two conditions:

// Is there a value stored in localStorage under the key 'cookieCount'?
// what this means is is cookieCount NOT EQUAL to 'null' meaning has it got a value

// And is there a value stored in localStorage under the key 'cookiePS'?
// && literally means "and this", so the same check as above but for the cookiePS value

// The && means both conditions must be true for the code inside the if block to run.

//? Step 2:
//  If the conditions are met from step 1, this line:

// Retrieves the stored 'cookieCount' value from localStorage
// Uses JSON.parse() to convert the stored string back into a number
// Assigns this value to the cookieCount variable

//? Step 3: 
// exactly the same as step 2

//? Step 4:
// This updates the texts of the cookieMainDisplay & cookiePSDisplay element to show the loaded cookie count. created earlier

//? Step 5:
// we've then called this function loadProgress() within the window.onload function at the top

function loadProgress() {
    if (localStorage.getItem('cookieCount') != null && localStorage.getItem('cookiePS') != null) {
        cookieCount = JSON.parse(localStorage.getItem('cookieCount'))
        cookiePS = JSON.parse(localStorage.getItem('cookiePS'))
        cookieMainDisplay.innerText = cookieCount;
        cookiePSDisplay.innerText = cookiePS;
    }
}
