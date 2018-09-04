
exports.up = knex =>
  knex.schema.table('user_place', t => {
    t.renameColumn('location_access_token', 'place_access_token');
  });

exports.down = knex =>
  knex.schema.table('user_place', t => {
    t.renameColumn('place_access_token', 'location_access_token');
  });

