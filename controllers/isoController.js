const IsoUser = require('../models/IsoUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerIso = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, companyName, gstNumber } = req.body;

    const existingUser = await IsoUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new IsoUser({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      companyName,
      gstNumber
    });
    await user.save();

    const token = jwt.sign({ id: user._id, type: 'iso' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'ISO registration successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) { next(err); }
};

exports.loginIsoUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await IsoUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, type: 'iso' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) { next(err); }
};

exports.getIsoUsers = async (req, res, next) => {
  try {
    const users = await IsoUser.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

exports.getIsoUser = async (req, res, next) => {
  try {
    const user = await IsoUser.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.deleteIsoUser = async (req, res, next) => {
  try {
    await IsoUser.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
