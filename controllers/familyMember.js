const crypto = require("crypto")
const { DataTypes } = require("sequelize")
const { v4 } = require("uuid")
const initModels = require("../models/init-models")
const { addEmailToQueue } = require("../bull")
const { Op } = require("sequelize")
const { QueryTypes } = require('sequelize');
const { sequelize, Sequelize } = require("../models/index")
const { greeting } = require("../cron")

const { familymember } = initModels(sequelize)

const { organization } = initModels(sequelize)
const { case_: caseModel } = initModels(sequelize)
const { user: userModel } = initModels(sequelize)

exports.register = async (req, res) => {
    try {

        const { first_name, last_name, middle_name, mobile, userType, email, password, user_id } = req.body
        let text = first_name + middle_name + last_name + mobile + userType

        const uid = crypto.createHash('sha256', process.env.SECRET).update(text).digest("hex")

        if (!uid) return res.status(400).json({ status: 400, error: "Bad Request" })

        const member = await familymember.findOne({ where: { uid: uid } })

        // WHEN MEMBER DOES NOT EXISTS CREATE MEMBER AND USER

        if (!member) {
            const healthray_id = v4().slice(0, 16)

            const newMember = await familymember.create({ first_name, middle_name, last_name, healthray_id, uid })


            const newUser = await userModel.create({ ...req.body, middle_name: undefined, member_id: newMember.id })
            addEmailToQueue(newUser)

            if (newUser.userType === "DOCTOR") greeting(newUser)


            await newMember.update({ user_id: newUser.id })
            return res.status(200).json({ status: 200, message: "User and Family Member registered sucessfully" })


        }
        return res.status(400).json({ status: 400, error: "Member already exists" })


    } catch (error) {
        console.log(error)
        return res.status(501).json({ status: 501, error: "Internal server error" })
    }
}


exports.addMember = async (req, res) => {

    try {

        const { first_name, last_name, middle_name, mobile, userType, email, password, user_id, user } = req.body
        let text = first_name + middle_name + last_name + mobile + userType

        const userExists = await userModel.findOne({ where: { id: user_id } })

        if (!userExists) return res.status(400).json({ status: 400, message: "User not exists with given user id" })

        const uid = crypto.createHash('sha256', process.env.SECRET).update(text).digest("hex")

        if (!uid) return res.status(400).json({ status: 400, error: "Bad Request" })

        const member = await familymember.findOne({ where: { uid: uid } })

        if (!member) {

            const healthray_id = v4().slice(0, 16)


            const newMember = await familymember.create({ ...req.body, uid, healthray_id })


            if (user === true) {
                const newUser = await userModel.create({ ...req.body, middle_name: undefined, member_id: newMember.id })
                addEmailToQueue(newUser)
                if (newUser.userType === "DOCTOR") greeting(newUser)


                return res.status(200).json({ status: 200, message: "User and member added successfully", newUser })

            }
            return res.status(200).json({ status: 200, message: "Member added successfully", newMember })

        }

        if (user === true) {

            const isUser = await userModel.findOne({ where: { member_id: member.id } })

            if (!isUser) {

                const newUser = await userModel.create({ ...req.body, middle_name: undefined, member_id: member.id })
                addEmailToQueue(newUser)
                if (newUser.userType === "DOCTOR") greeting(newUser)


                return res.status(200).json({ status: 200, message: "Member added as user successfully", newUser })

            }

            return res.status(400).json({ status: 400, error: "Bad Request", message: "User already exists" })

        }

        return res.status(400).json({ status: 400, error: "Bad Request", message: "Member already exists" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 500, error: "Internal Server Error" })
    }

}



// exports.addCase = async (req, res) => {

//     try {
//         const { familyMember_id, doctor_id } = req.body

//         const doctor = await userModel.findOne({ where: { id: doctor_id, userType: "DOCTOR" } })

//         if (!doctor) return res.status(404).json({ status: 404, error: "NOT FOUND", message: "Doctor not found with given doctor id" })

//         const familyMember = await familymember.findOne({ where: { id: familyMember_id } })

//         if (!familyMember) return res.status(404).json({ status: 404, error: "NOT FOUND", message: "Family member not found with given family member id" })


//         const case_id = await generateCaseId(doctor.first_name[0].toUpperCase())
//         const pname_caseId = await generatePNameId((familyMember.first_name[0] + familyMember.middle_name[0] + familyMember.last_name[0]).toUpperCase())
//         let case_no = 1
//         let pname_caseNumber = 1

//         const sDoctorsPatient = await caseModel.findAll({ where: { familyMember_id, doctor_id } })

//         if (!sDoctorsPatient.length == 0) {

//             const last = sDoctorsPatient.length - 1

//             const pname_caseId = sDoctorsPatient[last].pname_caseId

//             const findDoctor = await caseModel.findAll({ where: { doctor_id } })
//             case_no = findDoctor[findDoctor.length - 1].case_no + 1
//             pname_caseNumber = sDoctorsPatient[last].pname_caseNumber
//             pname_caseNumber++;
//             const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id })
//             return res.status(200).json({ status: 200, message: "Case added successfully", newCase })

//         }

//         const sDoctorPatient = await caseModel.findAll({ where: { doctor_id } })

//         if (!sDoctorPatient.length == 0) {

//             const last = sDoctorPatient.length - 1

//             case_no = sDoctorPatient[last].case_no;

//             case_no++;

//             const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id })
//             return res.status(200).json({ status: 200, message: "Case added successfully", newCase })

//         }

//         const doctorsPatient = await caseModel.findAll({ where: { familyMember_id } })

//         if (!doctorsPatient.length == 0) {

//             const last = doctorsPatient.length - 1
//             const pname_caseId = doctorsPatient[last].pname_caseId
//             let pname_caseNumber = doctorsPatient[last].pname_caseNumber
//             pname_caseNumber++;

//             const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id })
//             return res.status(200).json({ status: 200, message: "Case added successfully", newCase })

//         }

//         const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id })
//         return res.status(200).json({ status: 200, message: "Case added successfully", newCase })


//     } catch (error) {

//         console.log(error)

//         return res.status(500).json({ status: 500, error: "Internal server error", message: "Error while adding case" })

//     }

// }

exports.addCase = async (req, res) => {

    try {

        const { familyMember_id, doctor_id } = req.body

        const doctor = await userModel.findOne({ where: { id: doctor_id, userType: "DOCTOR" } })

        if (!doctor) return res.status(404).json({ status: 404, error: "NOT FOUND", message: "Doctor not found with given doctor id" })

        const familyMember = await familymember.findOne({ where: { id: familyMember_id } })

        if (!familyMember) return res.status(404).json({ status: 404, error: "NOT FOUND", message: "Family member not found with given family member id" })

        const org = await organization.findOne({ where: { created_by_id: doctor_id } })

        if (!org) return res.status(404).json({ status: 404, error: "Not found", message: "No organization found for given doctor id" })

        if (org.is_case_no_updated === false) {

            var case_id = String(org.case_prefix + '-' + (org.case_start_no + 1))

            const case_start_no = org.case_start_no + 1
            const is_case_no_updated = true
            await org.update({ case_start_no, is_case_no_updated })

        }
        else {
            const allCases = await caseModel.findAll({ where: { doctor_id } })

            if (allCases.length !== 0) {
                const lastCase = allCases[allCases.length - 1]
                var no = Number(lastCase.case_id.slice(3))
                no++;
                var case_id = org.case_prefix + '-' + no

            }
            else {

                var case_id = org.case_prefix + '-' + org.case_start_no
            }

        }

        const pname_caseId = await generatePNameId((familyMember.first_name[0] + familyMember.middle_name[0] + familyMember.last_name[0]).toUpperCase())
        let pname_caseNumber = 1
        let case_no = 1

        const sDoctorsPatient = await caseModel.findAll({ where: { familyMember_id, doctor_id } })

        if (!sDoctorsPatient.length == 0) {

            const last = sDoctorsPatient.length - 1

            const pname_caseId = sDoctorsPatient[last].pname_caseId

            const findDoctor = await caseModel.findAll({ where: { doctor_id } })
            case_no = findDoctor[findDoctor.length - 1].case_no + 1
            pname_caseNumber = sDoctorsPatient[last].pname_caseNumber
            pname_caseNumber++;
            const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id }, { includes: [{ model: familymember, as: 'patientDetails' }] })
            return res.status(200).json({ status: 200, message: "Appointment fixed successfully", newCase })

        }

        const sDoctorPatient = await caseModel.findAll({ where: { doctor_id } })

        if (!sDoctorPatient.length == 0) {

            const last = sDoctorPatient.length - 1

            case_no = sDoctorPatient[last].case_no;

            case_no++;

            const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id }, { includes: [{ model: familymember, as: 'patientDetails' }] })
            return res.status(200).json({ status: 200, message: "Appointment fixed successfully", newCase })

        }

        const doctorsPatient = await caseModel.findAll({ where: { familyMember_id } })

        if (!doctorsPatient.length == 0) {

            const last = doctorsPatient.length - 1
            const pname_caseId = doctorsPatient[last].pname_caseId
            let pname_caseNumber = doctorsPatient[last].pname_caseNumber
            pname_caseNumber++;

            const newCase = await caseModel.create({ case_id, case_no, pname_caseId, pname_caseNumber, doctor_id, familyMember_id }, { includes: [{ model: familymember, as: 'patientDetails' }] })
            return res.status(200).json({ status: 200, message: "Appointment fixed successfully", newCase })

        }



        const newCase = await caseModel.create({ familyMember_id, doctor_id, pname_caseId, pname_caseNumber, case_id, case_no }, { includes: [{ model: familymember, as: 'patientDetails' }] })
        return res.status(200).json({ status: 200, message: "Appointment fixed successfully", newCase })



    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, error: "Internal server error" })

    }
}


let init_caseId = 1
let init_pnameId = 1
const generateCaseId = async (first) => {

    const check = String(first + '-' + init_caseId)
    const caseId = await caseModel.findOne({ where: { case_id: check } })

    if (!caseId) {
        return (check)
    }
    init_caseId++;
    return String(first + '-' + init_caseId)

}


const generatePNameId = async (text) => {

    const check = String(text + '-' + init_pnameId)
    const pname_caseId = await caseModel.findOne({ where: { pname_caseId: check } })

    if (!pname_caseId) {
        return check
    }
    init_pnameId++;
    return String(text + '-' + init_pnameId)
}



exports.search = async (req, res) => {

    try {
        let searchField = ""
        const { body: payload } = req

        const { value } = req.params

        const findDoctor = await userModel.findOne({ where: { id: req.body.doctor_id, userType: 'DOCTOR' } })

        if (!findDoctor) return res.status(404).json({ status: 404, error: "Not found", message: "No doctor exists with given doctor id " })

        if (value.includes('-')) {

            if (value.indexOf('-') === 3) {
                searchField = "pname_caseId"
            }
            else {
                searchField = "case_id"
            }

        }
        else if (!isNaN(value) && value.length < 10) {
            searchField = "case_no"
        }
        else if (!isNaN(value) && value.length === 10) {
            searchField = "mobile"
        }

        else {
            searchField = "patientName"
        }

        // when child does not exists
        //         --select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name, " ", HEALTHRAY_DEMO.familymember.middle_name, " ", HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case
        //         --inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.famiHEALTHRAY_DEMO.user.id = HEALTHRAY_DEMO.familymember.user_id where HEALTHRAY_DEMO.case.doctor_id = 2 and HEALTHRAY_DEMO.user.member_id;

        //  when child exists
        //  select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name, " ", HEALTHRAY_DEMO.familymember.middle_name, " ", HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case 
        //  inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.familyMember_id 
        // inner join HEALTHRAY_DEMO.user on HEALTHRAY_DEMO.user.member_id = HEALTHRAY_DEMO.familymember.id where HEALTHRAY_DEMO.case.doctor_id = 2;

        if (value === ":value") {


            var allCases = await sequelize.query(`select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name," ",HEALTHRAY_DEMO.familymember.middle_name," ",HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.familyMember_id inner join HEALTHRAY_DEMO.user on HEALTHRAY_DEMO.user.id = HEALTHRAY_DEMO.familymember.user_id where HEALTHRAY_DEMO.case.doctor_id=${req.body.doctor_id}; `, { type: QueryTypes.SELECT })

        }
        else if (searchField === "case_id" || searchField === "case_no" || searchField === "pname_caseId") {

            var allCases = await sequelize.query(`select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name," ",HEALTHRAY_DEMO.familymember.middle_name," ",HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.familyMember_id inner join HEALTHRAY_DEMO.user on HEALTHRAY_DEMO.user.id = HEALTHRAY_DEMO.familymember.user_id  where HEALTHRAY_DEMO.case.doctor_id=${req.body.doctor_id} and HEALTHRAY_DEMO.case.${searchField} like '%${value}%';`, { type: QueryTypes.SELECT })

        } else if (searchField === "mobile") {
            var allCases = await sequelize.query(`select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name," ",HEALTHRAY_DEMO.familymember.middle_name," ",HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.familyMember_id inner join HEALTHRAY_DEMO.user on HEALTHRAY_DEMO.user.id = HEALTHRAY_DEMO.familymember.user_id  where HEALTHRAY_DEMO.case.doctor_id=${req.body.doctor_id} and HEALTHRAY_DEMO.user.${searchField} like '%${value}%';`, { type: QueryTypes.SELECT })

        } else {
            var allCases = await sequelize.query(`select HEALTHRAY_DEMO.case.case_id, HEALTHRAY_DEMO.case.case_no, HEALTHRAY_DEMO.case.pname_caseId, concat(HEALTHRAY_DEMO.familymember.first_name," ",HEALTHRAY_DEMO.familymember.middle_name," ",HEALTHRAY_DEMO.familymember.last_name) as "patientName", HEALTHRAY_DEMO.user.email, HEALTHRAY_DEMO.user.mobile from HEALTHRAY_DEMO.case inner join HEALTHRAY_DEMO.familymember on HEALTHRAY_DEMO.familymember.id = HEALTHRAY_DEMO.case.familyMember_id inner join HEALTHRAY_DEMO.user on HEALTHRAY_DEMO.user.id = HEALTHRAY_DEMO.familymember.user_id  where HEALTHRAY_DEMO.case.doctor_id=${req.body.doctor_id} and concat(HEALTHRAY_DEMO.familymember.first_name," ",HEALTHRAY_DEMO.familymember.middle_name," ",HEALTHRAY_DEMO.familymember.last_name) like "%${value}%";`, { type: QueryTypes.SELECT })

        }

        return res.status(200).json({ status: 200, allCases })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, error: "Internal Server Error" })
    }
}





