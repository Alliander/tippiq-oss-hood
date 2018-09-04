exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('service_tag_whitelist', t => {
      t.uuid('service_id').references('service.id');
      t.uuid('tag_id').references('tag.id');
    }),
  ])
    .then(() =>
      Promise.all([
        knex('permission').insert({ name: 'get_service_tags', label: 'Get Service Tags' }),
        knex('permission').insert({ name: 'update_service_tags', label: 'Update Service Tag' }),
      ])
    )
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'administrator', permission: 'get_service_tags' },
          { role: 'administrator', permission: 'update_service_tags' },
        ])
    );

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('service_tag_whitelist'),
  ])
    .then(() =>
      Promise.all([
        knex('role_permission').where({
          role: 'administrator',
          permission: 'get_service_tags',
        }).del(),
        knex('role_permission').where({
          role: 'administrator',
          permission: 'update_service_tags',
        }).del(),
      ])
    )
    .then(() =>
      Promise.all([
        knex('permission').where({ name: 'get_service_tags' }).del(),
        knex('permission').where({ name: 'update_service_tags' }).del(),
      ])
    );
