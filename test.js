

require("dotenv").config({quiet: true})
const Ngrok = require("./src")

const ngrok = new Ngrok({
	token: process.env.NGROK_TOKEN,
	debug: false,
	// notify: {
	// 	user: process.env.PUSHOVER_USER,
	// 	token: process.env.PUSHOVER_TOKEN,
	// },
	tunnels: [
		{
			subdomain: "bb-visuals-server-blokm",
			active: true,
		},
		// {
		// 	subdomain: "botlab2",
		// 	active: true
		// }
	]
})

ngrok.start()