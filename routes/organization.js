const router = require("express")()
const {createOrganization, updateDetails, getOrganisation, getAllOrganization} = require("../controllers/organization")

router.post("/addorganization", createOrganization)
router.put("/updateorganization", updateDetails)
router.get("/getorganization/:id", getOrganisation)
router.get("/allorganization", getAllOrganization)

module.exports = router
