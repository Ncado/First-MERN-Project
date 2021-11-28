const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
const app = express();


app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/link', require('./routes/link.routes'))
app.use("/api/plane", require('./addPlane'))
const PORT = config.get('port') || 5000

async function start() {
	try {
		await mongoose.connect(config.get('mongoUri'), {
		useNewUrlParser:true,
		useUnifiedTopology: true,
		
		
		})
		app.listen(PORT , () => console.log('pagnali'))
	}
	catch (e) {
		console.log('Server Eror', e.message)
		process.exit(1);
	}
}
start()