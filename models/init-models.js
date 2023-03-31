var DataTypes = require("sequelize").DataTypes;
var _sequelizeMetum = require("./sequelizeMetum");
var _case_ = require("./case");
var _familymember = require("./familymember");
var _organization = require("./organization");
var _user = require("./user");

function initModels(sequelize) {
  var sequelizeMetum = _sequelizeMetum(sequelize, DataTypes);
  var case_ = _case_(sequelize, DataTypes);
  var familymember = _familymember(sequelize, DataTypes);
  var organization = _organization(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    sequelizeMetum,
    case_,
    familymember,
    organization,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
