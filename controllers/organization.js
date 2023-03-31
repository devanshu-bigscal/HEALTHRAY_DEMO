const client = require('../config/redis');
const { sequelize } = require('../models/index');
const initModels = require('../models/init-models');
const { organization } = initModels(sequelize);


const { user: userModel } = initModels(sequelize);


exports.createOrganization = async (req, res) => {
    try {
        const { body: payload } = req;

        const findDoctor = await userModel.findOne({ where: { id: payload.created_by_id, userType: "DOCTOR" } });

        if (!findDoctor) return res.status(404).json({ status: 404, error: 'Not found', message: 'Doctor not found with given doctor id' });

        const case_prefix = `${payload.name[0] + payload.name[1]}`.trim().toUpperCase();

        const case_start_no = 0;
        const newOrganisation = await organization.create({ ...payload, case_start_no, case_prefix: case_prefix });
        return res.status(200).json({ status: 200, message: 'new organization created', newOrganisation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
};


exports.updateDetails = async (req, res) => {
    try {
        const { body: payload } = req;

        const findDoctor = await userModel.findOne({ where: { id: payload.created_by_id, userType: "DOCTOR" } });

        if (!findDoctor) return res.status(404).json({ status: 404, error: 'Not found', message: 'Doctor not found with given doctor id' });

        const org = await organization.findOne({ where: { created_by_id: payload.created_by_id } })

        if (!org) return res.status(404).json({ status: 404, error: "Not found", message: "No organization registered with given doctor id" })

        await organization.update({ ...payload }, { where: { created_by_id: payload.created_by_id } });

        return res.status(200).json({ status: 200, message: 'details updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};



exports.getOrganisation = async (req, res) => {

    try {

        const key = `organization:${req.params.id}`

        client.get(key).then(async (org) => {
            if (org) {
                return res.status(200).json({ status: 200, organization: JSON.parse(org), message: "i am from redis" })
            }

            const searchOrg = await organization.findOne({ where: { id: req.params.id } })

            if (!searchOrg) return res.status(404).json({ status: 404, error: "Not found", message: "No organization found " })

            client.set(key, JSON.stringify(searchOrg)).then((org) => {
                client.get(key).then(org => {
                    return res.status(200).json({ status: 200, organization: JSON.parse(org) })

                })
            })

        }).catch(err => console.log(err))

    } catch (error) {
        console.log(error)
    }
}


exports.getAllOrganization = async (req, res) => {

    try {
        const key = "org"

        client.get(key).then(async data => {
            if (data) {
                return res.status(200).json({ status: 200, allOrg: JSON.parse(data) })

            }

            const allOrg = await organization.findAll()
            client.setEx(key, 60, JSON.stringify(allOrg)).then(data => {
                client.get(key).then(data => {
                    return res.status(200).json({ status: 200, allOrg: JSON.parse(data) })
                })
            })
        })


    } catch (error) {
        console.log(error)
    }
}
