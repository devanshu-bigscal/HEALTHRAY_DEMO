const router = require("express")()
const { register, addMember, addCase, search } = require("../controllers/familyMember.js")

router.post("/register", register)
router.post("/addmember", addMember)
router.post("/addcase", addCase)
router.get("/search/:value", search)
module.exports = router