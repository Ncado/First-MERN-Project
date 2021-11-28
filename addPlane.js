const { Router } = require('express');
const Plane = require('./routes/models/Plane');
const User = require('./routes/models/User');
const Bilet = require('./routes/models/Bilet')
const config = require('config');
const auth = require('./middleware/auth.middleware');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const router = Router();


router.post(
	'/add',
	async (req, res) => {
		try {
			const {
				from,
				to,
				freeEconom,
				freeBuisness,
				freeFirst,
				valueEconom,
				valueBuisness,
				valueFirst,
				departureDate,
				arrivalDate
			} = req.body
			const plane = new Plane({
				from,
				to,
				freeEconom,
				freeBuisness,
				freeFirst,
				valueEconom,
				valueBuisness,
				valueFirst,
				departureDate,
				arrivalDate
			})
			await plane.save()
			return res.json({ message: "plane succesful add" })
		} catch (e) {
			res.status(500).json({ message: e + "   eror" })
		}
	})


router.get('/all', auth, async (req, res) => {
	try {
		const planes = await Plane.find()
		res.json(planes)
	} catch (e) {
		res.status(500).json({ message: 'Щось пішло не так спробуйте знову' })
	}
})


router.post('/:id', auth, async (req, res) => {
	try {
		const plane = await Plane.findById(req.params.id)
		res.json(plane)
	} catch (e) {
		res.status(500).json({ message: 'Щось пішло не так спробуйте знову' })
	}
})



router.get('/addCredits',auth, async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
		const decoded = jwt.verify(token, config.get('jwtSecret'))
		const user = await User.findById(decoded.userId)

		
		User.updateMany({_id: decoded.userId}, {credits: user.credits+22222200}, function(err, result){
     
		
			if(err) return console.log(err);
			console.log(result);
		});
		res.json(user.credits)
	} catch (e) {
		res.status(500).json({ message: e+ "   err" })
	}
})


router.get('/getCredits', async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"



		const decoded = jwt.verify(token, config.get('jwtSecret'))
		const user = await User.findById(decoded.userId)
		res.json(user.credits)
		
	} catch (e) {
		res.status(500).json({ message: e + "    err" })
	}
})

router.put('/buyBilet', auth, async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1] 
		const decoded = jwt.verify(token, config.get('jwtSecret'))
		const user = await User.findById(decoded.userId)
		const {
		"PlaneId":PlaneId,
		"BindedEconom":BindedEconom, 
		"BindedBuisness":BindedBuisness,
		"BindedFirst":BindedFirst, 
		"Place":PlaceMass,
		"Prise":Prise
		} = req.body
		const plane = await Plane.findById(req.body.PlaneId)
		if(user.credits>req.body.Prise){
			const bilet = new Bilet({
				from:plane.from ,
				to:plane.to,
				bookedEconom: req.body.BindedEconom, 
				bookedBuisness:req.body.BindedBuisness,
				bookedFirst: req.body.BindedFirst, 
				place:2 , 
				departureDate:plane.departureDate, 
				arrivalDate:plane.arrivalDate
			})
			await bilet.save()
			User.updateMany({_id: decoded.userId},
				 {
					 credits: user.credits-req.body.Prise, 
					 $push: { bilets: bilet._id }},
					function(err, result){
				if(err) return console.log(err);
				console.log(result);
			  });
			if(req.body.Place[0]!==null){
				plane.freeEconom.splice(req.body.Place[0], 1)
				Plane.updateOne({_id: PlaneId}, {
					freeEconom: plane.freeEconom}, 
					function(err, result){
					if(err) return console.log(err);
					console.log(result);
				});	
			}
			if(req.body.Place[1]!==null){
				plane.freeBuisness.splice(req.body.Place[1], 1)
				Plane.updateOne({_id: PlaneId}, {
					freeBuisness: plane.freeBuisness}, 
					function(err, result){
					if(err) return console.log(err);
					console.log(result);
				});	
			}
			if(req.body.Place[2]!==null){
				plane.freeFirst.splice(req.body.Place[2], 1)
				Plane.updateOne({_id: PlaneId}, {
					freeFirst: plane.freeFirst}, 
					function(err, result){
					if(err) return console.log(err);
					console.log(result);
				});	
			}
		}
		res.json(req.body.Place)
	} catch (e) {
		res.status(500).json({ message: e+ "   err    "})
	}
})


router.get('/myBilets', auth, async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1] 
		const decoded = jwt.verify(token, config.get('jwtSecret'))
		const user = await User.findById(decoded.userId)
		const userBilets = user.bilets
		//const bilet = await Bilet.find()
		let bilets = []
		let i;
		for (i = 0; i < userBilets.length; i++) {
		const bilet = await Bilet.findById(userBilets[i])
			bilets.push(bilet);
		}
		res.json(bilets)

	} catch (e) {
		res.status(500).json({ message: 'Щось пішло не так спробуйте знову' })
	}
})





module.exports = router