"use strict";var map,restaurant=void 0,reviews=void 0;window.initMap=function(){fetchRestaurantFromURL(function(e,t,n){e?console.error(e):t&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})};var fetchRestaurantFromURL=function(n){if(self.restaurant&&self.reviews)n(null,self.restaurant,self.reviews);else{var e=getParameterByName("id");e?(DBHelper.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?(fillRestaurantHTML(),n(null,t,null)):console.error(e)}),DBHelper.fetchReviews(e,function(e,t){self.reviews=t,console.log(self.reviews),t?(fillReviewsHTML(),n(null,null,t)):console.error(e)})):(error="No restaurant id in URL",n(error,null,null))}},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;var t=document.getElementById("restaurant-info"),n=document.createElement("picture"),r=document.createElement("source");r.setAttribute("data-srcset",DBHelper.smallImageUrlForRestaurant(e)),r.setAttribute("media","(max-width: 674px)"),n.appendChild(r);var a=document.createElement("source");a.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)),a.setAttribute("media","(min-width: 675px)"),n.appendChild(a);var i=document.createElement("img");i.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",i.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),i.setAttribute("alt",e.name),i.id="restaurant-info-img",i.classList.add("lazyload"),n.appendChild(i),t.appendChild(n),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,document.getElementById("restaurant_id").value=e.id,e.operating_hours&&fillRestaurantHoursHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);var i=document.createElement("td");i.innerHTML=e[n],r.appendChild(i),t.appendChild(r)}},fillReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h2");if(n.innerHTML="Reviews",t.appendChild(n),!e){var r=document.createElement("p");return r.innerHTML="No reviews yet!",void t.appendChild(r)}var a=document.getElementById("reviews-list");e.forEach(function(e){a.appendChild(createReviewHTML(e))}),t.appendChild(a)},createReviewHTML=function(e){var t=document.createElement("li"),n=document.createElement("div"),r=document.createElement("span");r.innerHTML=e.name,r.classList.add("res-name"),n.appendChild(r);var a=document.createElement("span");a.innerHTML=e.date,a.classList.add("res-date"),n.appendChild(a),n.classList.add("res-head"),n.setAttribute("tabindex","0"),t.appendChild(n);var i=document.createElement("p"),l=document.createElement("span");l.innerHTML="Rating: "+e.rating,l.classList.add("res-rating"),i.appendChild(l),i.setAttribute("tabindex","0"),t.appendChild(i);var s=document.createElement("p");return s.innerHTML=e.comments,s.classList.add("res-comments"),s.setAttribute("tabindex","0"),t.appendChild(s),t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Review"),t},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,n.setAttribute("aria-current","page"),n.setAttribute("tabindex","0"),t.appendChild(n)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null};"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)})});