const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webPush = require('web-push');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 4000;

app.get("/", (req, res) => res.send("Hello World!"));
app.get('/send-notification', (req, res) => {
	const subscription = dummyDb.subsription;
	const message = 'Hello World!';
	try {
		console.log('SENDING NOTIFICATION');
		sendNotification(subscription, message);
		console.log('NOTIFICATION SENT');
		res.json({ message: 'message sent'});
	} catch(e) {
		console.log('ERROR on send-notification', e);
	}
});

const dummyDb = { subsription: null } // dummy in-memory store

const saveToDatabase = async subscription => {
	console.log('SAVING SUB TO DB', subscription);
	dummyDb.subsription = subscription;
}

app.post('/save-subscription', async (req, res) => {
	console.log('HANDLE SAVE SUB REQUEST');
	const subscription = req.body;
	await saveToDatabase(subscription);

	res.json({ message: 'success'});
});

const vapidKeys = {
	publicKey: 'BIoUl2G-PbkvecRJaar5pDqO-prbySLN1iYrQ7M56PGXsKfObMt1YqYO-_dOSJ2xiM0nxbIV20R5udl6UwP-4AY',
	privateKey: 'BHYCqr59feNZj-kFN-4vdUaf8T2UJic-QIpzAQ6HT_k',
}

webPush.setVapidDetails(
	'mailto:samgrigg@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey,
);

const sendNotification = (subscription, dataToSend = '') => {
	if (!subscription) {
		throw new Error('Trying to send notification without subscription');
	}
	console.log('Subscription', subscription);
	console.log('dataToSend', dataToSend);
	try {
		webPush.sendNotification(subscription, dataToSend);
	} catch(e) {
		console.log('ERROR webPush.sendNotification');
	}
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
