// localstorage setup and cleanup for add to cart option
if (localStorage.getItem("cart_number") == null) localStorage.setItem("cart_number", "[]")
var str = JSON.parse(localStorage.getItem("cart_number"))

const shop = [
	{
		id: 1,
		name: 'US Polo T-Shirt',
		img: "us_polo_t_shirt.jpg",
		rating: 3,
		basePrice: 30,
		description: "Original US Polo T-Shirt Free returns within 15 days.	100% Cotton",
		properties: [
			{
				size: "S",
				price: 30
			},
			{
				size: "M",
				price: 35
			},
			{
				size: "L",
				price: 40
			},
			{
				size: "XL",
				price: 50
			}
		]
	},
	{
		id: 2,
		name: 'Sleeved Summer Viscose Shirt',
		img: "short_sleeve_shirt.jpg",
		rating: 4.5,
		basePrice: 30,
		description: "Gavazzi Men Black Regular Fit Collar Short Sleeved Summer Viscose Shirt.",
		properties: [
			{
				size: "S",
				price: 30
			},
			{
				size: "M",
				price: 35
			},
			{
				size: "L",
				price: 40
			},
			{
				size: "XL",
				price: 50
			}
		]
	},
	{
		id: 3,
		name: 'Navy Cargo Pocket Trousers',
		img: "jeans.jpg",
		rating: 5,
		basePrice: 40,
		description: "DAMGA JEANS Men's Navy Cargo Pocket Trousers. 9% 98 Cotton 2% Elastane.",
		properties: [
			{
				size: "S",
				price: 35
			},
			{
				size: "M",
				price: 35
			},
			{
				size: "L",
				price: 40
			},
			{
				size: "XL",
				price: 40
			},
		]
	},
	{
		id: 4,
		name: 'Cut Jeans',
		img: "cut_jeans.jpg",
		rating: 3.5,
		basePrice: 50,
		description: "Newtime Men's Jeans Skinny Fit Lycra Spiked Blue. 9% 98 Cotton 2% Elastane.",
		properties: [
			{
				size: "28-31",
				price: 50
			},
			{
				size: "32-34",
				price: 50
			},
			{
				size: "36-34",
				price: 54
			},
		]
	},
	{
		id: 5,
		name: 'Beige Slim Fit Chino Pants',
		img: "biege_slim.jpg",
		rating: 5,
		basePrice: 130,
		description: "Pierre Cardin Men's Beige Slim Fit Chino Pants. 97% Cotton 3% Elastane 1%.",
		properties: [
			{
				size: "28-31",
				price: 128
			},
			{
				size: "32-34",
				price: 130
			},
			{
				size: "36-34",
				price: 135
			},
		]
	},
	{
		id: 6,
		name: 'Black Italian Cut Trousers',
		img: "italian.jpg",
		rating: 4,
		basePrice: 120,
		description: "ukdwear Men's Black Italian Cut Plaid Fabric Trousers.",
		properties: [
			{
				size: "32-34",
				price: 110
			},
			{
				size: "28-31",
				price: 120
			},
			{
				size: "36-34",
				price: 120
			},
		]
	}
]


// shop item display
if (document.getElementById('shop_items'))

	shop.forEach(e => {
		var div = document.createElement('div')
		var check = str.includes(e.id) ? "Remove from Cart" : "Add to cart"
		div.innerHTML = `
			<img loading="lazy" src="./assets/images/shop/${ e.img }" />
			<div class="flex justify-between">
				<p><b class="text-primary">Price: </b>$${ e.basePrice }</p>
				<p><b class="text-primary">Rating: </b>${ e.rating } / 5</p>
			</div>
			<h3 class="text-primary">${ e.name }</h3>
			<p class="lead">${ e.description }</p>
			<p><b class="text-primary">Sizes: </b> ${ e.properties.map(p => ' ' + p.size) }</p>
			<a class="button button-primary" href="./order.html">Order now</a>
			<button class="button pointer" onclick="addCart(${ e.id })" id="cart_button_${ e.id }">			
				${ check }
			</button>
		`
		div.setAttribute('class', 'item')
		document.getElementById('shop_items').appendChild(div)
	})


// order item display
if (document.getElementById("order_items")) {

	shop.forEach((e) => {
		var tr = document.createElement("tr")
		var check = str.includes(e.id) ? "checked" : ""
		tr.innerHTML = `
			<td>
				<label class="check">
				<input type="checkbox" ${ check } name="check_${ e.id }" value="${ e.id }" id="id_${ e.id }">
						${ e.name }
				</label>
			</td>
			<td>${ e.properties.map((p, index) =>
		(`
						<input type="radio" id="size_${ e.id }_${ index }" name="item_${ e.id }_price" value="${ p.price }">
						<label for="size_${ e.id }_${ index }" class="pointer radio"><b>Size:</b> ${ p.size } - <b>Price:</b> ${ p.price }</label><br>
					`)
		).join('') }
		<div id="price_err_${ e.id }" style="color: red"></div>
			</td>
			<td>
				<select name="item_${ e.id }_quantity" id="quantity_${ e.id }">
					<option value="">Quantity</option>
					<option value="1">1 item</option>
					<option value="2">2 items</option>
					<option value="3">3 items</option>
					<option value="4">4 items</option>
					<option value="5">5 items</option>
				</select>
				<div id="quantity_err_${ e.id }" style="color: red"></div>
			</td>
			<td id="cost_${ e.id }"></td>
		`

		document.getElementById("order_items").prepend(tr)
	})


	// order validation and cost calculation
	document.getElementById('order').addEventListener('submit', e => {
		e.preventDefault()

		let cost = 0
		let items = document.querySelectorAll('input[type=checkbox]')

		var empty = [].filter.call(items, el => !el.checked)
		var selected = [].filter.call(items, el => el.checked)

		if (items.length == empty.length) {
			alert("Select atleast one item")
			return false
		} else {
			let quantityErr = priceErr = false

			selected.forEach((item) => {

				// used "querySelector" and not "querySelectorAll" because we don't need 
				// to check for all the radios as only one of them can be checked at a time
				// :checked make sure of that

				let price = document.querySelector(`input[id*=size_${ item.value }]:checked`)
				let quantity = document.querySelector(`select[id*=quantity_${ item.value }]`)

				// displaying error msg if user forgot to select his size or quantity
				if (price == null) {
					priceErr = true
					document.querySelector('#price_err_' + item.value).innerText = "Please select a size"
				} else document.querySelector('#price_err_' + item.value).innerText = ""

				if (quantity.value == "") {
					quantityErr = true
					document.querySelector('#quantity_err_' + item.value).innerText = "Please select quantity"
				} else document.querySelector('#quantity_err_' + item.value).innerText = ""


				if (price != null && quantity.value != "") {
					// displaying the price in front of each item
					document.querySelector(`#cost_${ item.value }`).innerText = '$ ' + price.value * quantity.value
					cost += price.value * quantity.value
				}
			})

			if (!priceErr && !quantityErr) {
				// displaying the cost after adding the tax
				document.getElementById('final_cost').innerText = cost > 500 ? `$ ${ (cost * 0.15) + cost }` : `$ ${ cost }`
				document.getElementById('total_cost').innerText = `$ ${ cost }`
				document.getElementById('tax_cost').innerText = cost > 500 ? `$ ${ cost * 0.15 }` : 0
				document.querySelector("#confirmation").style.display = "table-row"
			} else window.scrollTo(0, 0)

		}
	})

}


// cart functionality
let cartBadge = document.querySelector('#cart_badge')

cartBadge.innerText = JSON.parse(localStorage.getItem("cart_number")).length

addCart = (e) => {
	let prevCart = JSON.parse(localStorage.getItem("cart_number"))
	if (!prevCart.includes(e)) {
		localStorage.setItem("cart_number", JSON.stringify([ ...prevCart, e ]))
		cartBadge.innerText = ++prevCart.length

		document.querySelector(`#cart_button_${ e }`).innerText = "Remove from cart"
	} else {
		localStorage.setItem("cart_number", JSON.stringify(prevCart.filter(i => i !== e)))
		document.querySelector(`#cart_button_${ e }`).innerText = "Add to cart"
		cartBadge.innerText = --prevCart.length

	}
}


confirmation = (e) => {
	localStorage.setItem("cart_number", "[]")
	document.querySelector('#cart_badge').innerText = 0
	alert(e ? "Thankyou for shopping with us" : "Application has been withdrawn")
	location.reload()
}


// Navbar home transparent
if (document.querySelector("#nav_home")) window.onscroll = () => scrollFunction()

function scrollFunction () {
	console.log(document.body.scrollTop)
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		document.querySelector("#nav_home").classList.remove('transparent')
		document.querySelector("#fb_icon").src = "./assets/images/fb.svg"
		document.querySelector("#insta_icon").src = "./assets/images/insta.svg"
		document.querySelector("#twitter_icon").src = "./assets/images/twitter.svg"
		document.querySelector("#cart_icon").src = "./assets/images/cart.svg"
		document.querySelector("#brand_logo").src = "./assets/images/logo.svg"

	} else {
		document.querySelector("#nav_home").classList.add('transparent')
		document.querySelector("#fb_icon").src = "./assets/images/fb-white.svg"
		document.querySelector("#insta_icon").src = "./assets/images/insta-white.svg"
		document.querySelector("#twitter_icon").src = "./assets/images/twitter-white.svg"
		document.querySelector("#cart_icon").src = "./assets/images/cart-white.svg"
		document.querySelector("#brand_logo").src = "./assets/images/logo-white.svg"
	}
}

function removeClass (el, c) {
	if (el) el.classList.remove(c)
}


if (document.getElementById('contact_form'))
	document.getElementById('contact_form').addEventListener('submit', e => {
		e.preventDefault()
		let f_n = document.getElementById("first_name")
		let f_n_err = document.getElementById("first_name_err")
		let s_n = document.getElementById("sur_name")
		let s_n_err = document.getElementById("sur_name_err")
		let em = document.getElementById("email")
		let em_err = document.getElementById("email_err")
		let c = document.getElementById("comments")
		let c_err = document.getElementById("comments_err")
		let err = false

		removeClass(em, "border-danger")
		removeClass(em, "border-success")
		removeClass(f_n, "border-success")
		removeClass(f_n, "border-danger")
		removeClass(s_n, "border-success")
		removeClass(s_n, "border-danger")
		removeClass(c, "border-danger")
		removeClass(c, "border-success")

		if (f_n.value == "") {
			f_n_err.innerText = "First name is required"
			f_n.classList.add('border-danger')
			err = true
		} else {
			f_n_err.innerText = ""
			f_n.classList.add('border-success')
		}

		if (s_n.value == "") {
			s_n_err.innerText = "Sur name is required"
			s_n.classList.add('border-danger')
			err = true

		} else {
			s_n_err.innerText = ""
			s_n.classList.add('border-success')
		}

		if (em.value == "") {
			em_err.innerText = "Email is required"
			em.classList.add('border-danger')
			err = true

		} else {
			em_err.innerText = ""
			em.classList.add('border-success')
		}
		if (c.value == "") {
			c_err.innerText = "Comments are required"
			c.classList.add('border-danger')
			err = true

		} else {
			c_err.innerText = ""
			c.classList.add('border-success')
		}

		if (!err) {
			alert("Your response has been recieved. Thankyou")
			location.reload()
		}


	})