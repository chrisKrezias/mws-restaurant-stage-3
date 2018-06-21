let restaurants,
    neighborhoods,
    cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", (event) => {
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
}

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById("neighborhoods-select");
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement("option");
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById("cuisines-select");

    cuisines.forEach(cuisine => {
        const option = document.createElement("option");
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: loc,
        scrollwheel: false
    });
    // updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
    const cSelect = document.getElementById("cuisines-select");
    const nSelect = document.getElementById("neighborhoods-select");

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById("restaurants-list");
    ul.innerHTML = "";

    // Remove all map markers
    self.markers.forEach(m => m.setMap(null));
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById("restaurants-list");
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    restaurants.forEach(restaurant => {
        createHTMLImages(restaurant);
    });
    addMarkersToMap();
    ul.setAttribute("role", "list");
}

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
    const li = document.createElement("li");

    const favourite = document.createElement("div");
    favourite.innerHTML = "<div onClick = 'favouriteToggle(this, " + restaurant.id + ")'></div>";
    favourite.classList.add("favourite");
    if (restaurant.is_favorite) {
        favourite.children[0].classList.add("active");
    }
    li.append(favourite);

    const picture = document.createElement("picture");
    picture.id = "picture-" + restaurant.id;
    li.append(picture);

    const name = document.createElement("h3");
    name.innerHTML = restaurant.name;
    name.setAttribute("tabindex", "0");
    li.append(name);

    const neighborhood = document.createElement("p");
    neighborhood.innerHTML = restaurant.neighborhood;
    neighborhood.setAttribute("tabindex", "0");
    li.append(neighborhood);

    const address = document.createElement("p");
    address.innerHTML = restaurant.address;
    address.setAttribute("tabindex", "0");
    li.append(address);

    const more = document.createElement("a");
    more.innerHTML = "View Details";
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.setAttribute("aria-label", "View restaurant details");

    li.append(more);
    li.setAttribute("aria-label", "Restaurant information");
    li.setAttribute("tabindex", "0");

    return li;
}

const createHTMLImages = (restaurant) => {
    const picId = "picture-" + restaurant.id;
    const picture = document.getElementById(picId);

    const source_small = document.createElement("source");
    source_small.setAttribute("data-srcset", DBHelper.smallImageUrlForRestaurant(restaurant));
    source_small.setAttribute("media", "(max-width: 674px)");
    picture.appendChild(source_small);

    const source_large = document.createElement("source");
    source_large.setAttribute("data-srcset", DBHelper.imageUrlForRestaurant(restaurant));
    source_large.setAttribute("media", "(min-width: 675px)");
    picture.appendChild(source_large);

    const image = document.createElement("img");
    image.className = "restaurant-img";
    image.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    image.setAttribute("data-src", DBHelper.imageUrlForRestaurant(restaurant));
    image.setAttribute("alt", restaurant.name);
    image.classList.add("lazyload");

    picture.appendChild(image);
}

/**
 * Add markers for current restaurants to the map.
 */
const addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, "click", () => {
            window.location.href = marker.url
        });
        self.markers.push(marker);
    });
}

const favouriteToggle = function(btn, res_id) {
    var xhr = new XMLHttpRequest();
    if (!btn.classList.contains("active")) {
        xhr.open("PUT", "http://localhost:1337/restaurants/" + res_id + "/");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                btn.classList.add("active");
            }
        };
        xhr.send(JSON.stringify({
            is_favorite: true
        }));
    } else {
        xhr.open("PUT", "http://localhost:1337/restaurants/" + res_id + "/");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                btn.classList.remove("active");
            }
        };
        xhr.send(JSON.stringify({
            is_favorite: false
        }));
    }
};

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("sw.js").then(function(registration) {
            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function(err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
        });

        navigator.serviceWorker.ready.then(function(swRegistration) {
            return swRegistration.sync.register('myFirstSync');
        });
    });
}