exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('user_place', t => {
      t.json('location');
      t.dateTime('location_updated_at');
      t.string('location_access_token');
    }),
    knex('permission')
      .insert([
        { name: 'get_place_location', label: 'Get place location' },
      ]),
  ])
    .then(() => knex('role_permission')
      .insert([{ role: 'authenticated', permission: 'get_place_location' }]));

exports.down = (knex, Promise) =>
  Promise.all([
    knex('role_permission').where({ permission: 'get_place_location' }).del(),
    knex('permission').where({ name: 'get_place_location' }).del(),
  ])
    .then(() => knex.schema.table('user_place', t => {
      t.dropColumns(['location', 'location_updated_at', 'location_access_token']);
    }));
