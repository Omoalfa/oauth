const fs = require('fs');
const path = require('path');

module.exports = function (globalConfig, projectConfig) {
  const testDataFile = path.join(__dirname, 'data.json');

  // Initial test data
  const baseData = {
    "users": [
      {
        "id": 1,
        "name": "Omoalfa Dev",
        "type": "EMPLOYEE",
        "email": "admin@advertyzly.com",
        "password": "password",
        "avatar": "https://google.com",
        "username": "Omoalfa"
      }
    ],
    "organizations": [
      {
        "email": "admin@advertyzly.com",
        "slug": "platform",
        "name": "Advertyzly",
        "website": "advertyzly.com",
        "type": "PLATFORM",
        "id": 1,
      }
    ],
    "user_roles": [],
    "customer_groups": [],
    "roles": [],
    "tokens": []
  }

  fs.writeFileSync(testDataFile, JSON.stringify(baseData, null, 2), 'utf8');
};

