restaurants = [];

function get_restaurant(businessid){
   var url = "https://raw.githubusercontent.com/mageshsridhar/yelp-restaurant-data/master/business.json"
  d3.json(url)
  .then(function(data) {
  //console.log(data['businesses']);
  restaurant = data['businesses'].filter(function(d){ return d.business_id == businessid });
  console.log(restaurant);
   document.getElementById('Restaurant_Name').innerHTML = restaurant[0]['name'];
   document.getElementById('stars').innerHTML = restaurant[0]['stars'];
   document.getElementById('Restaurant_Address').innerHTML = restaurant[0]['address'];
          recommend_restaurants(restaurant);
  
});
  //console.log(all_restaurants);
}

function recommend_restaurants(restaurant){
	//console.log(restaurant[0]['stars']);
	d3.json("business.json")
	.then(function(data){
		restaurants = data['businesses'].filter(function(d){ 
		return ((d.stars >= restaurant[0].stars) && 
			(d.cuisine == restaurant[0].cuisine) && 
			(d.business_id != restaurant[0].business_id) &&
			(distance(d.latitude,d.longitude,restaurant[0].latitude,restaurant[0].longitude) <= 8))});
		//console.log(restaurants);
        if(restaurants[0]['name']!=null){
		document.getElementById('restaurant1_name').innerHTML = restaurants[0]['name'];
		document.getElementById('restaurant1_address').innerHTML = restaurants[0]['address'];
        var rec_res1 = document.getElementById('Big_Jimmy_s_Pizza_1330_E_Apach')
        rec_res1.style.cursor = 'pointer';
        rec_res1.onclick = function() {
            var qString = "?"+ restaurants[0]['business_id'];
            window.location.href = "Restaurant_page.html" + qString;
            };
        }
        if(restaurants[1]['name']!=null)
        {
		document.getElementById('restaurant2_name').innerHTML = restaurants[1]['name'];
		document.getElementById('restaurant2_address').innerHTML = restaurants[1]['address'];
        var rec_res2 = document.getElementById('Gus_s_New_York_Pizza_829_S_Rur');
        rec_res2.style.cursor = 'pointer';
        rec_res2.onclick = function() {
            var qString = "?"+ restaurants[1]['business_id'];
            window.location.href = "Restaurant_page.html" + qString;
            }; 
        }
        if(restaurants[2]['name']!=null)
        {
		document.getElementById('restaurant3_name').innerHTML = restaurants[2]['name'];
		document.getElementById('restaurant3_address').innerHTML = restaurants[2]['address'];
        var rec_res3 = document.getElementById('Hungry_Howie_s_Pizza_1045_E_Le')
        rec_res3.style.cursor = 'pointer';
        rec_res3.onclick = function() {
            var qString = "?"+ restaurants[2]['business_id'];
            window.location.href = "Restaurant_page.html" + qString;
            };    
        }

	});
}

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		//if (unit=="K") { dist = dist * 1.609344 }
		//if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}
//filter_restaurants("hey");