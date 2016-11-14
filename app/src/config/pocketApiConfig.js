module.exports = {
	pocketUrl: {
		request : "https://getpocket.com/v3/oauth/request",
		authorize : "https://getpocket.com/v3/oauth/authorize",
		get: "https://getpocket.com/v3/get",
		add: "https://getpocket.com/v3/add",
		modify: "https://getpocket.com/v3/send"
	},
	headers: {
		"content-type": "application/x-www-form-urlencoded",
		"X-Accept": "application/json"
	}
}
