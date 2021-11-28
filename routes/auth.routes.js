const { Router } = require('express');
const User = require('./models/User');
const config = require('config');
const {check, validationResult} = require('express-validator');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const router = Router();
// /api/auth/registr
router.post(
	'/register',
	[
	  check('email', 'Некоректний email').isEmail(),
	  check('password', 'Мінімальна довжина паролю 6 символів')
		.isLength({ min: 6 })
	],
	async (req, res) => {
	try {
	  const errors = validationResult(req)
  
	  if (!errors.isEmpty()) {
		return res.status(400).json({
		  errors: errors.array(),
		  message: 'Некоректні данні при реєстрації'
		})
	  }
  
	  const {email, password} = req.body
  
	  const candidate = await User.findOne({ email })
  
	  if (candidate) {
		return res.status(400).json({ message: 'Такий користувач вже існує' })
	  }
  
	  const hashedPassword = await bcrypt.hash(password, 12)
	  const user = new User({ email, password: hashedPassword })
  
	  await user.save()
  
	  res.status(201).json({ message: 'Користувач створений' })
  
	} catch (e) {
	  res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' })
	}
  })
  
  // /api/auth/login
router.post(
	'/login',
	[
	  check('email', 'Введіть валідний email').normalizeEmail().isEmail(),
	  check('password', 'Введіть пароль').exists()
	],
	async (req, res) => {
	try {
	  const errors = validationResult(req)
  
	  if (!errors.isEmpty()) {
		return res.status(400).json({
		  errors: errors.array(),
		  message: 'Некоректні данні при вході в систему'
		})
	  }
  
	  const {email, password} = req.body
  
	  const user = await User.findOne({ email })
  
	  if (!user) {
		return res.status(400).json({ message: 'Користувач не знайдений' })
	  }
  
	  const isMatch = await bcrypt.compare(password, user.password)
  
	  if (!isMatch) {
		return res.status(400).json({ message: 'Неправильний пароль, спробуйте знову' })
	  }
  
	  const token = jwt.sign(
		{ userId: user.id },
		config.get('jwtSecret'),
		{ expiresIn: '100h' }
	  )
  
	  res.json({ token, userId: user.id })
  
	} catch (e) {
	  res.status(500).json({ message: e +"  err" })
	}
  })
  
  
  module.exports = router