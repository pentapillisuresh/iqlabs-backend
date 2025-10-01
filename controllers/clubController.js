const ClubCategory = require("../models/ClubCategory");
const ClubSubfield = require("../models/ClubSubfield");
const ClubUser = require("../models/ClubUser");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.seedCategories = async () => {
  const staticCategories = [
    { name: "For Professionals & Entrepreneurs", description: "Business and professional growth" },
    { name: "For Adventure & Personal Growth", description: "Travel, adventure, and self development" },
    { name: "For Community & Relationships", description: "Social and cultural activities" },
    { name: "Sports & Recreation Club", description: "Sports and recreation" },
  ];

  for (const cat of staticCategories) {
    const exists = await ClubCategory.findOne({ name: cat.name });
    if (!exists) await ClubCategory.create(cat);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ClubCategory.find().lean();
    res.json(categories.map(c => ({
      id: c._id,
      name: c.name,
      description: c.description
    })));
  } catch (err) { next(err); }
};

exports.getCategoriesWithSubfields = async (req, res, next) => {
  try {
    const categories = await ClubCategory.find().lean();
    const cats = await Promise.all(categories.map(async c => {
      const subs = await ClubSubfield.find({ category: c._id }).lean();
      return { ...c, subfields: subs };
    }));
    res.json(cats);
  } catch (err) { next(err); }
};

exports.addSubfield = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description, amount } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const categoryExists = await ClubCategory.findById(categoryId);
    if (!categoryExists) return res.status(400).json({ message: "Invalid category" });

    const subfield = new ClubSubfield({
      category: categoryId,
      name,
      description,
      amount: Number(amount) || 0,
      imageUrl,
    });

    await subfield.save();
    res.status(201).json(await subfield.populate("category", "name"));
  } catch (err) {
    next(err);
  }
};

exports.updateSubfield = async (req, res, next) => {
  try {
    const { subfieldId } = req.params;
    const { name, description, amount } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const subfield = await ClubSubfield.findByIdAndUpdate(
      subfieldId,
      { $set: updateData },
      { new: true }
    ).populate("category", "name");

    if (!subfield) return res.status(404).json({ message: "Subfield not found" });
    res.json({ message: "Subfield updated successfully", subfield });
  } catch (err) {
    next(err);
  }
};

exports.deleteSubfield = async (req, res, next) => {
  try {
    const { subfieldId } = req.params;
    const subfield = await ClubSubfield.findByIdAndDelete(subfieldId);
    if (!subfield) return res.status(404).json({ message: "Subfield not found" });
    res.json({ message: "Subfield deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getSubcategories = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });

    const subs = await ClubSubfield.find({ category: categoryId }).lean();
    res.json(
      subs.map((s) => ({
        id: s._id,
        name: s.name,
        amount: s.amount,
        description: s.description,
        image: s.imageUrl,
      }))
    );
  } catch (err) {
    next(err);
  }
};

exports.registerClubUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, categoryId, subCategoryId } = req.body;

    const existingUser = await ClubUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const categoryExists = await ClubCategory.findById(categoryId);
    if (!categoryExists) return res.status(400).json({ message: "Invalid category" });

    const subExists = await ClubSubfield.findById(subCategoryId);
    if (!subExists) return res.status(400).json({ message: "Invalid subcategory" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new ClubUser({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      category: categoryId,
      subfield: subCategoryId,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, type: 'club' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: "Club Registration successful",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.loginClubUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await ClubUser.findOne({ email })
      .populate("category", "name")
      .populate("subfield", "name amount description");

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, type: 'club' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        category: user.category,
        subfield: user.subfield
      },
      token
    });
  } catch (err) { next(err); }
};

exports.getClubUsers = async (req, res, next) => {
  try {
    const users = await ClubUser.find()
      .select('-password')
      .populate("category", "name")
      .populate("subfield", "name amount description");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getClubUser = async (req, res, next) => {
  try {
    const user = await ClubUser.findById(req.params.id)
      .select('-password')
      .populate("category", "name")
      .populate("subfield", "name amount description");

    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
