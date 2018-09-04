exports.up = knex =>
  knex('role').insert([{ name: 'openapi', label: 'OpenAPI' }])
    .then(() =>
      knex('role_permission').insert([
        { role: 'cards_administrator', permission: 'add_card' },
        { role: 'cards_administrator', permission: 'delete_card' },
        { role: 'cards_administrator', permission: 'update_card' },
        { role: 'openapi', permission: 'add_card' },
      ])
    );

exports.down = (knex, Promise) =>
  Promise
    .all([
      knex('role_permission').where({ role: 'cards_administrator' }).del(),
      knex('role_permission').where({ role: 'openapi' }).del(),
    ])
    .then(() => knex('role').where({ name: 'openapi' }).del());
