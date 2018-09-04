
exports.seed = knex => {
  const st = require('knex-postgis')(knex); // eslint-disable-line global-require

  function geomFromText(geomText) { // eslint-disable-line require-jsdoc
    return st.transform(st.geomFromText(geomText, 4326), 28992);
  }

  return knex('location').insert([
    {
      id: 'b1f4025c-5609-11e5-858a-07060ee6e8ab',
      type: 'HouseAddress',
      nr: 20,
      street_name: 'Spaklerweg',
      zipcode_letters: 'BA',
      zipcode_digits: 1096,
      geometry: geomFromText('POINT(4.91640 52.33788)'),
    },
    {
      id: 'b2804d2a-5609-11e5-ac40-e3fadfa00e3e',
      type: 'ZipcodeAddress',
      zipcode_digits: 2011,
      city_name: 'Haarlem',
      municipality_name: 'Haarlem',
      geometry: geomFromText('POINT(4.63592 52.38512)'),
    },
    {
      // Nieuwe Gracht in Haarlem
      id: '00000000-0000-0000-0000-000000000001',
      geometry: geomFromText('POINT(4.63592 52.38512)'),
    },
    {
      // Jachthaven aan Veluwemeer
      id: '00000000-0000-0000-0000-000000000002',
      geometry: geomFromText('POINT(5.63592 52.38512)'),
    },
    {
      // Westermaatweg bij Almelo
      id: '00000000-0000-0000-0000-000000000003',
      geometry: geomFromText('POINT(6.63592 52.38512)'),
    },
    {
      // End User 1
      id: '00000000-0000-0000-0000-000000000011',
      geometry: geomFromText('POINT(6.00000 52.00000)'),
    },
    {
      // End User 2
      id: '00000000-0000-0000-0000-000000000012',
      geometry: geomFromText('POINT(5.00000 53.00000)'),
    },
  ]);
};
