const CareerUser = require('../models/CareerUser');
const CareerAnswer = require('../models/CareerAnswer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerCareerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await CareerUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new CareerUser({ name, email, password: hashedPassword, phone, address });
    await user.save();

    const token = jwt.sign({ id: user._id, type: 'career' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Career user registered',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) { next(err); }
};

exports.loginCareerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await CareerUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, type: 'career' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) { next(err); }
};

exports.submitAnswers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const answers = req.body.answers;
    if (!Array.isArray(answers)) return res.status(400).json({ message: 'Answers must be array' });

    await CareerAnswer.deleteMany({ user: userId });

    const docs = answers.map(a => ({
      user: userId,
      questionId: a.questionId,
      questionText: a.questionText,
      answer: a.answer
    }));
    await CareerAnswer.insertMany(docs);

    res.json({ message: 'Answers saved' });
  } catch (err) { next(err); }
};

exports.getCareerUsers = async (req, res, next) => {
  try {
    const users = await CareerUser.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

exports.getCareerUser = async (req, res, next) => {
  try {
    const user = await CareerUser.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    const answers = await CareerAnswer.find({ user: req.params.id }).sort({ questionId: 1 });
    res.json({ user, answers });
  } catch (err) { next(err); }
};

exports.getCareerPdf = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await CareerUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const answers = await CareerAnswer.find({ user: userId }).sort({ questionId: 1 });

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=career-${user._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(16).text("Career User Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phone}`);
    doc.moveDown();

    answers.forEach((a, index) => {
      doc.fontSize(12).text(`${index + 1}. ${a.answer || "No Answer"}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (err) { next(err); }
};
