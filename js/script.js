//console.log(Backbone)

// -------------- Models -------------- //
var DetailModel = Backbone.Model.extend ({
	url: "",

	_apiKey: "0fy2eyfojigiuqlnw7bbjkm3",

	_generateUrl: function(id) {
		var fullUrl = "https://openapi.etsy.com/v2/listings/" + id + ".js?includes=Images&callback=getData&api_key="
		this.url = fullUrl
	}
})

var HomeCollection = Backbone.Collection.extend ({
	_apiKey: "0fy2eyfojigiuqlnw7bbjkm3",
	url: "https://openapi.etsy.com/v2/listings/active.js?includes=Images&callback=getData&api_key=",
	model: DetailModel
	// parse: function(JSONData) {
	// 	return JSONData
	// }
})

// -------------- Views -------------- //

var HomeView = Backbone.View.extend ({
	el: "#container",

	initialize: function(inputCollection) {
		this.collection = inputCollection
		var boundRender = this._render.bind(this)
		this.collection.on("sync", boundRender)
	},

	events: {
		"click .listingStyles": "_triggerDetailView", 
		"keydown input": "_searchKeywords",
		"click #rightArrow": "_seeNextListing",
		"click #leftArrow": "_seePreviousListing"
	},

	_triggerDetailView: function(clickEvent) {
		//console.log(clickEvent.target)
		var listingNode = clickEvent.target
		// router listening for hash change
		window.location.hash = "detail/" + listingNode.getAttribute('listing_id')
		// console.log("success")
	},

	_seeNextListing: function(clickEvent) {
		var rightArrow = clickEvent.target
		console.log("rightArrow")
		var listingsArray = this.collection.models[0].attributes.results
		for(var i=0; i < listingsArray.length; i++){
			var nextListing = listingsArray[i + 1]
			console.log(nextListing)

		window.location.hash = "detail/" + nextListing.listing_id
		}
	},

	// _seeNextListing: function(clickEvent) {
	// 	var rightArrow = clickEvent.target
	// 	console.log("rightArrow")
	// 	var listingsArray = this.collection.models[0].attributes.results
	// 	for(var i=0; i < listingsArray.length; i++){
	// 		var nextListing = listingsArray[i + 1]
	// 		console.log(nextListing)

	// 	window.location.hash = "detail/" + nextListing.listing_id
	// 	}
	// },

	_seePreviousListing: function(clickEvent) {
		var leftArrow = clickEvent.target
		console.log("leftArrow")
		// window.location.hash = "detail/" + listingNode.getAttribute('listing_id')
	},

	_searchKeywords: function(keyEvent) {
		console.log("search from input")
		var searchKeywords = keyEvent.target.value
		if(keyEvent.keyCode === 13){
			window.location.hash = 'search/' + searchKeywords
		}
	},

	_render: function() {
		// console.log(this.collection)
		var listingsArray = this.collection.models[0].attributes.results
		// console.log(listingsArray)
		var totalHtmlString = "<input>"
		for(var i=0; i < listingsArray.length; i++){
			var singleListing = listingsArray[i]
			// var listing_id = singleListing.listing_id
			// console.log(listing_id)
			totalHtmlString += this._generateHtml(singleListing)
		}
		this.el.innerHTML = totalHtmlString
	},

	_generateHtml: function(response) {
		// console.log(response)
		var imagesArray = response.Images
		for(var i=0; i < imagesArray.length; i++){
			var singleImage = imagesArray[i]
			// console.log(singleImage)
			var thumbnail = singleImage['url_570xN']
			// console.log(thumbnail)
		}
		var listing_id = response.listing_id
		// console.log(listing_id)
		var htmlString = "<div class='listingStyles'>"
			htmlString +=   "<img listing_id='" + listing_id + "' src='" + thumbnail + "'/>"
			htmlString +=	"<div class='listingInfoStyles'>"
			htmlString += 		"<p>" + response.title + "</p>"
			htmlString += 		"<p>" + response.listing_id + "</p>"
			htmlString += 	"</div>"
			htmlString += "</div>"
		return htmlString
	}
	
})


var DetailView = Backbone.View.extend ({
	el: "#container",

	initialize: function(inputModel) {
		this.model = inputModel
		var boundRender = this._render.bind(this)
		this.model.on("sync", boundRender)
	},

	events: {
		"keydown input": "_searchKeywords"
	},

	_searchKeywords: function(keyEvent) {
		console.log("search from input")
		var searchKeywords = keyEvent.target.value
		if(keyEvent.keyCode === 13){
			window.location.hash = 'search/' + searchKeywords
		}
	},

	_render: function() {
		// console.log(this.model)
		// console.log("yee haw")
		var itemDetails = this.model.attributes.results[0]

		var imagesArray = itemDetails.Images
		for(var i=0; i < imagesArray.length; i++){
			var singleImage = imagesArray[i]
			// console.log(singleImage)
			var thumbnail = singleImage['url_570xN']
			// console.log(thumbnail)
		}
		var htmlString = "<input>"
		    htmlString += "<div class='listingStylesDetail'>"
			htmlString +=   "<img src='" + thumbnail + "'/>"
			htmlString +=	"<div class='listingInfoStylesDetail'>"
			htmlString += 		"<p>" + itemDetails.title + "</p>"
			htmlString += 		"<p>" + itemDetails.description + "</p>"
			htmlString += 		"<p>" + itemDetails.listing_id + "</p>"
			htmlString += 	"</div>"
			htmlString += "</div>"
			htmlString += "<div class='arrowButtons'>"
			htmlString += 		"<div id='leftArrow'>"
			htmlString += 			"<img src='./images/arrows.svg'/>"
			htmlString += 		"</div>"
			htmlString += 		"<div id='rightArrow'>"
			htmlString += 			"<img src='./images/arrows.svg'/>"
			htmlString += 		"</div>"			
			htmlString += "</div>"
		this.el.innerHTML = htmlString	
	},

})

// -------------- Router -------------- //
// routes: 
// home route will render the "active listings"
// detail route will render a individual product on Etsy in full detail

var etsyRouter = Backbone.Router.extend ({
	routes: {
		"home": "handleHomeView",
		"detail/:id": "handleDetailView",
		"search/:searchKeywords": "handleSearchView",
		"*default": "handleHomeView"
	},

	handleHomeView: function() {
		// console.log("handling home view")
		var nc = new HomeCollection()
		var nv = new HomeView(nc)
		nc.fetch({
			dataType: "JSONP",
			data: {
				// q: query,
				api_key: nc._apiKey
			}
		})
	},

	handleDetailView: function(id) {
		// console.log("...ROUTER-handleDetailView")
		var singleModel = new DetailModel()
		singleModel._generateUrl(id)
		var detailView = new DetailView(singleModel)
		
		singleModel.fetch({
			dataType: "JSONP",
			data: {
 				api_key: singleModel._apiKey
 			}
 		})
	},

	handleSearchView: function(searchKeywords) {
		console.log("searching...handleSearchView")
		var nsc = new HomeCollection()
		var nsv = new HomeView(nsc)
		nsc.fetch({
			dataType: "JSONP",
			data: {
				keywords: searchKeywords, 
				api_key: nsc._apiKey
			}
		}) 
	},

	initialize: function() {
		Backbone.history.start()
	}

})

var rtr = new etsyRouter()