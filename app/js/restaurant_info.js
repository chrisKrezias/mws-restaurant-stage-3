let restaurant;
let reviews;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant, reviews) => {
        if (error) { // Got an error!
            console.error(error);
        } else if (restaurant) {
            self.map = new google.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = (callback) => {
    if (self.restaurant && self.reviews) { // restaurant and reviews already fetched!
        callback(null, self.restaurant, self.reviews)
        return;
    }
    const id = getParameterByName("id");
    if (!id) { // no id found in URL
        error = "No restaurant id in URL"
        callback(error, null, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant, null)
        });
        DBHelper.fetchReviews(id, (error, reviews) => {
            self.reviews = reviews;
            console.log(self.reviews);
            if (!reviews) {
                console.error(error);
                return;
            }
            fillReviewsHTML();
            callback(null, null, reviews);
        });
    }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById("restaurant-name");
    name.innerHTML = restaurant.name;

    const address = document.getElementById("restaurant-address");
    address.innerHTML = restaurant.address;

    const section = document.getElementById("restaurant-info");

    const picture = document.createElement("picture");

    const source_small = document.createElement("source");
    // source_small.srcset = DBHelper.smallImageUrlForRestaurant(restaurant);
    source_small.setAttribute("data-srcset", DBHelper.smallImageUrlForRestaurant(restaurant));
    source_small.setAttribute("media", "(max-width: 674px)");
    picture.appendChild(source_small);

    const source_large = document.createElement("source");
    // source_large.srcset = DBHelper.imageUrlForRestaurant(restaurant);
    source_large.setAttribute("data-srcset", DBHelper.imageUrlForRestaurant(restaurant));
    source_large.setAttribute("media", "(min-width: 675px)");
    picture.appendChild(source_large);

    const image = document.createElement("img");
    // image.src = DBHelper.smallImageUrlForRestaurant(restaurant);
    image.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    image.setAttribute("data-src", DBHelper.imageUrlForRestaurant(restaurant));
    image.setAttribute("alt", restaurant.name);
    image.id = "restaurant-info-img"
    image.classList.add("lazyload");
    picture.appendChild(image);

    section.appendChild(picture);

    const cuisine = document.getElementById("restaurant-cuisine");
    cuisine.innerHTML = restaurant.cuisine_type;

    const restaurant_id = document.getElementById("restaurant_id");
    restaurant_id.value = restaurant.id;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    // fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById("restaurant-hours");
    for (let key in operatingHours) {
        const row = document.createElement("tr");

        const day = document.createElement("td");
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement("td");
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.reviews) => {
    const container = document.getElementById("reviews-container");
    const title = document.createElement("h4");
    title.innerHTML = "Reviews";
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement("p");
        noReviews.innerHTML = "No reviews yet!";
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById("reviews-list");
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
    const li = document.createElement("li");
    const head = document.createElement("div");
    const name = document.createElement("span");
    name.innerHTML = review.name;
    name.classList.add("res-name");
    head.appendChild(name);

    const date = document.createElement("span");
    const createdAt = new Date(review.createdAt);
    date.innerHTML = createdAt.getDate() + '/' + (createdAt.getMonth() + 1) + '/' + createdAt.getFullYear();
    date.classList.add("res-date");
    head.appendChild(date);
    head.classList.add("res-head");
    head.setAttribute("tabindex", "0");

    li.appendChild(head);

    const rating = document.createElement("p");
    const rate_text = document.createElement("span");
    rate_text.innerHTML = `Rating: ${review.rating}`;
    rate_text.classList.add("res-rating");
    rating.appendChild(rate_text);
    rating.setAttribute("tabindex", "0");
    li.appendChild(rating);

    const comments = document.createElement("p");
    comments.innerHTML = review.comments;
    comments.classList.add("res-comments");
    comments.setAttribute("tabindex", "0");
    li.appendChild(comments);

    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-label", "Review");

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById("breadcrumb");
    const li = document.createElement("li");
    li.innerHTML = restaurant.name;
    li.setAttribute("aria-current", "page");
    li.setAttribute("tabindex", "0");
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("sw.js").then(function(registration) {
            // Registration was successful
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function(err) {
            // registration failed :(
            console.log("ServiceWorker registration failed: ", err);
        });
    });
}

var form = document.getElementById("form-review");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    var http = new XMLHttpRequest();
    var url = "http://localhost:1337/reviews";
    // var data = new FormData(form);
    var data = serialize(form);
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onerror = function() {
        alert("Connection problem");
        var key = document.getElementById("restaurant_id").value;
        console.log(key + ", " + data);
        idbReviews.set(key, data);
    };

    http.send(data);

    if (navigator.onLine) {
        location.reload();
    }
});