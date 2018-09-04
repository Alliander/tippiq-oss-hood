exports.up = knex =>
  knex('permission')
    .insert([
      { name: 'send_contact_form_email', label: 'Send contact form email' },
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'anonymous', permission: 'send_contact_form_email' },
        ])
    );

exports.down = knex =>
  knex('role_permission')
    .where({ permission: 'send_contact_form_email' })
    .del()
    .then(() =>
      knex('permission')
        .where({ name: 'send_contact_form_email' })
        .del()
    );
