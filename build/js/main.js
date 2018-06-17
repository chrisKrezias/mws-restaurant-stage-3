"use strict";var map,restaurants=void 0,neighborhoods=void 0,cuisines=void 0,markers=[];document.addEventListener("DOMContentLoaded",function(e){fetchNeighborhoods(),fetchCuisines()});var fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods(function(e,t){e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,n=document.getElementById("neighborhoods-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})},fetchCuisines=function(){DBHelper.fetchCuisines(function(e,t){e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})},fillCuisinesHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,n=document.getElementById("cuisines-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})};window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants()};var updateRestaurants=function(){var e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,r=t.selectedIndex,a=e[n].value,s=t[r].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,s,function(e,t){e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})},resetRestaurants=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},fillRestaurantsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,t=document.getElementById("restaurants-list");e.forEach(function(e){t.append(createRestaurantHTML(e))}),addMarkersToMap()},createRestaurantHTML=function(e){var t=document.createElement("li"),n=document.createElement("picture");t.append(n);var r=document.createElement("source");r.setAttribute("data-srcset",DBHelper.smallImageUrlForRestaurant(e)),r.setAttribute("media","(max-width: 674px)"),n.appendChild(r);var a=document.createElement("source");a.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)),a.setAttribute("media","(min-width: 675px)"),n.appendChild(a);var s=document.createElement("img");s.className="restaurant-img",s.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",s.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),s.setAttribute("alt",e.name),s.classList.add("lazyload"),n.appendChild(s);var i=document.createElement("h3");i.innerHTML=e.name,i.setAttribute("tabindex","0"),t.append(i);var o=document.createElement("p");o.innerHTML=e.neighborhood,o.setAttribute("tabindex","0"),t.append(o);var c=document.createElement("p");c.innerHTML=e.address,c.setAttribute("tabindex","0"),t.append(c);var l=document.createElement("a");return l.innerHTML="View Details",l.href=DBHelper.urlForRestaurant(e),l.setAttribute("aria-label","View restaurant details"),t.append(l),t.setAttribute("aria-label","Restaurant information"),t.setAttribute("tabindex","0"),t},addMarkersToMap=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",function(){window.location.href=t.url}),self.markers.push(t)})};"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)}),navigator.serviceWorker.ready.then(function(e){return e.sync.register("myFirstSync")})}),DBHelper.checkConnection();