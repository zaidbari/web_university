const shop = [
	{
		id: 1,
		name: 'US Polo T-Shirt',
		img: "us_polo_t_shirt.jpg",
		rating: 4.5,
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
		rating: 4.5,
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
		rating: 4.5,
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
		rating: 4.5,
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
		rating: 4.5,
		basePrice: 120,
		description: "ukdwear Men's Black Italian Cut Plaid Fabric Trousers. Slight tonal shift may occur because the product is shot in daylight",
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

if (document.getElementById('shop_items'))
	shop.forEach(e => {
		var div = document.createElement('div')
		div.innerHTML = `
			<img src="./assets/images/shop/${ e.img }" />
			<div class="flex justify-between">
				<p><b class="text-primary">Price: </b>$${ e.basePrice }</p>
				<p><b class="text-primary">Rating: </b>${ e.rating } / 5</p>
			</div>
			<h3 class="text-primary">${ e.name }</h3>
			<p class="lead">${ e.description }</p>
			<p><b class="text-primary">Sizes: </b> ${ e.properties.map(p => ' ' + p.size) }</p>
			<a class="button button-primary" href="./order.html">Order now</a>
		`
		div.setAttribute('class', 'item')
		document.getElementById('shop_items').appendChild(div)
	})


if (document.getElementById("order_items")) {

	shop.forEach((e) => {
		var tr = document.createElement("tr")

		tr.innerHTML = `
			<td>
				<label class="check">
				<input type="checkbox" name="check_${ e.id }" value="${ e.id }" id="id_${ e.id }">
						${ e.name }
				</label>
			</td>
			<td>${ e.properties.map((p, index) => {
			return (`
						<input type="radio" id="size_${ e.id }_${ index }" name="item_${ e.id }_price" value="${ p.price }">
						<label for="size_${ e.id }_${ index }"><b>Size:</b> ${ p.size } - <b>Price:</b> ${ p.price }</label><br>
					`)
		}).join('') }
		<div id="price_err_${ e.id }" style="color: red"></div>
			</td>
			<td>
				<select name="item_${ e.id }_quantity" id="quantity_${ e.id }">
					<option value="">Quantity</option>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
				<div id="quantity_err_${ e.id }" style="color: red"></div>
			</td>
			<td id="cost_${ e.id }"></td>

		`


		document.getElementById("order_items").appendChild(tr)
	})


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


			selected.forEach((item) => {

				// used "querySelector" and not "querySelectorAll" because we don't need 
				// to check for all the radios as only one of them can be checked at a time
				// :checked make sure of that

				let price = document.querySelector(`input[id*=size_${ item.value }]:checked`)
				let quantity = document.querySelector(`select[id*=quantity_${ item.value }]`)

				// displaying error msg if user forgot to select his size or quantity
				document.querySelector('#price_err_' + item.value).innerText = price == null ? "Please select a size" : ""
				document.querySelector('#quantity_err_' + item.value).innerText = quantity.value == "" ? "Please select quantity" : ""

				if (price != null && quantity.value != "") {
					// displaying the price in front of each item
					document.querySelector(`#cost_${ item.value }`).innerText = '$ ' + price.value * quantity.value
					cost += price.value * quantity.value
				}
			})

			// displaying the cost after adding the tax
			document.getElementById('final_cost').innerText = cost > 500 ? cost * 0.15 + cost : cost
		}
	})

}
