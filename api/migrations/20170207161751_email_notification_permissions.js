exports.up = knex =>
  knex('permission')
    .insert([
      { name: 'set_email_notification', label: 'Set email notification' },
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'authenticated', permission: 'set_email_notification' },
        ])
    );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'set_email_notification' })
    .del()
    .then(() => knex('permission').where({ name: 'set_email_notification' }).del());
