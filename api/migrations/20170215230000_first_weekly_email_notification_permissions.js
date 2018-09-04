exports.up = knex =>
  knex('permission')
    .insert([
      { name: 'send_first_weekly_notification', label: 'Send first weekly notification' },
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'authenticated', permission: 'send_first_weekly_notification' },
        ])
    );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'send_first_weekly_notification' })
    .del()
    .then(() => knex('permission').where({ name: 'send_first_weekly_notification' }).del());
