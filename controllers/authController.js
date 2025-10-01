const jwt = require('jsonwebtoken');

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { role: 'admin', email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    return res.json({
  message: 'Login successful',
  token,
  user: {
    email,
    role: 'admin',
    name: 'Administrator'
  }
});

  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
