"use strict";var map,restaurant=void 0,reviews=void 0;window.initMap=function(){fetchRestaurantFromURL(function(e,t,r){e?console.error(e):t&&(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})};var fetchRestaurantFromURL=function(r){if(self.restaurant&&self.reviews)r(null,self.restaurant,self.reviews);else{var e=getParameterByName("id");e?(DBHelper.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?(fillRestaurantHTML(),r(null,t,null)):console.error(e)}),DBHelper.fetchReviews(e,function(e,t){self.reviews=t,console.log(self.reviews),t?(fillReviewsHTML(),r(null,null,t)):console.error(e)})):(error="No restaurant id in URL",r(error,null,null))}},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;var t=document.getElementById("restaurant-info"),r=document.createElement("picture"),n=document.createElement("source");n.setAttribute("data-srcset",DBHelper.smallImageUrlForRestaurant(e)),n.setAttribute("media","(max-width: 674px)"),r.appendChild(n);var a=document.createElement("source");a.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)),a.setAttribute("media","(min-width: 675px)"),r.appendChild(a);var i=document.createElement("img");i.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",i.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)),i.setAttribute("alt",e.name),i.id="restaurant-info-img",i.classList.add("lazyload"),r.appendChild(i),t.appendChild(r),document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,document.getElementById("restaurant_id").value=e.id,e.operating_hours&&fillRestaurantHoursHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var r in e){var n=document.createElement("tr"),a=document.createElement("td");a.innerHTML=r,n.appendChild(a);var i=document.createElement("td");i.innerHTML=e[r],n.appendChild(i),t.appendChild(n)}},fillReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.reviews,t=document.getElementById("reviews-container"),r=document.createElement("h2");if(r.innerHTML="Reviews",t.appendChild(r),!e){var n=document.createElement("p");return n.innerHTML="No reviews yet!",void t.appendChild(n)}var a=document.getElementById("reviews-list");e.forEach(function(e){a.appendChild(createReviewHTML(e))}),t.appendChild(a)},createReviewHTML=function(e){var t=document.createElement("li"),r=document.createElement("div"),n=document.createElement("span");n.innerHTML=e.name,n.classList.add("res-name"),r.appendChild(n);var a=document.createElement("span"),i=new Date(e.createdAt);a.innerHTML=i.getDate()+"/"+(i.getMonth()+1)+"/"+i.getFullYear(),a.classList.add("res-date"),r.appendChild(a),r.classList.add("res-head"),r.setAttribute("tabindex","0"),t.appendChild(r);var l=document.createElement("p"),s=document.createElement("span");s.innerHTML="Rating: "+e.rating,s.classList.add("res-rating"),l.appendChild(s),l.setAttribute("tabindex","0"),t.appendChild(l);var o=document.createElement("p");return o.innerHTML=e.comments,o.classList.add("res-comments"),o.setAttribute("tabindex","0"),t.appendChild(o),t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Review"),t},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),r=document.createElement("li");r.innerHTML=e.name,r.setAttribute("aria-current","page"),r.setAttribute("tabindex","0"),t.appendChild(r)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var r=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null};"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").then(function(e){console.log("ServiceWorker registration successful with scope: ",e.scope)},function(e){console.log("ServiceWorker registration failed: ",e)})}),$("#form-review").on("submit",function(e){event.preventDefault(),e.preventDefault(),$.ajax({url:"http://localhost:1337/reviews",type:"post",data:$("#form-review").serialize(),success:function(){location.reload()},error:function(){alert("Connection problem");var e=$("#restaurant_id").attr("value"),t=$("#form-review").serialize();console.log(e+", "+t),idbReviews.set(e,t)}})});