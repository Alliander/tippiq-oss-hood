exports.up = knex =>
  knex('permission')
    .insert([
      { name: 'login_user', label: 'Login user' },
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'anonymous', permission: 'login_user' },
        ])
    );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'login_user' })
    .del()
    .then(() => knex('permission').where({ name: 'login_user' }).del());
