
const ngrok = require("ngrok")
const Logger = require("@ryanforever/logger").v4
const logger = new Logger(__filename, {debug: true})
const fs = require("fs")
const path = require("path")
const Notify = require("@ryanforever/notify")
const os = require("os")
const notify = new Notify({
	user: process.env.PUSHOVER_USER,
	token: process.env.PUSHOVER_TOKEN,
	appName: "botlab"
})

const title = `
########################
######## NGROK #########
########################
`


function Ngrok(config = {}) {
	const logger = new Logger("ngrok", {debug: config.debug ?? false})

	const token = config.token
	
	this.hostname = os.hostname().replace(/\.local/,"").toLowerCase().trim()
	this.tunnels = []

	if (config.tunnels) this.tunnels = config.tunnels.map(x => new Tunnel(x))

	if (config.notify) {
		const notify = new Notify({
			...config.notify,
			appName: config.notify.appName || this.hostname
		})
	}

	this.start = async function() {
		logger.debug(`start`)

		console.log(title)

		let active = this.tunnels.filter(x => x.active)
		if (!active.length) return logger.warn(`no active tunnels to start`)

		if (token) {
			await ngrok.authtoken(token)
			logger.debug(`token set!`)
		}
		let now = new Date(Date.now())
		logger.log(`starting ${active.length} tunnels @ ${now.toLocaleString()}\n`)

		for (let tunnel of active) {

			await ngrok.connect(tunnel).then(url => {
				logger.log(`${url} tunnel open `)
				if (config.notify) notify(`tunnel connected on ${this.hostname}: ${tunnel.subdomain}`, {title: "NGROK"})
			}).catch(err => {
				// logger.log(err)
				logger.error(err.body)
			})


		}
	}

	function Tunnel(d = {}) {
		this.subdomain = d.subdomain
		this.proto = d.proto || "http"
		this.addr = d.addr || 80
		this.region = d.region || "us"
		this.active = d.active ?? false

		Object.assign(this, d)
	}

}

















module.exports = Ngrok