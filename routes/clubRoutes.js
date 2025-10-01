const express = require("express");
const router = express.Router();
const clubCtrl = require("../controllers/clubController");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

router.post("/subfields/:categoryId", auth, upload.single("image"), clubCtrl.addSubfield);
router.put("/subfields/:subfieldId", auth, upload.single("image"), clubCtrl.updateSubfield);
router.delete("/subfields/:subfieldId", auth, clubCtrl.deleteSubfield);

router.get("/categories", clubCtrl.getCategories);
router.get("/categories-with-subfields", clubCtrl.getCategoriesWithSubfields);

router.get("/subcategories", clubCtrl.getSubcategories);
router.post("/register", clubCtrl.registerClubUser);
router.post("/login", clubCtrl.loginClubUser);
router.get("/users", auth, clubCtrl.getClubUsers);
router.get("/user/:id", auth, clubCtrl.getClubUser);

module.exports = router;
