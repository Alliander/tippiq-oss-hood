exports.up = knex =>
  knex('permission')
    .insert([
      { name: 'get_all_services', label: 'Get All Services' },
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'anonymous', permission: 'get_all_services' },
        ])
    );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'get_all_services' })
    .del()
    .then(() => knex('permission').where({ name: 'get_all_services' }).del());
