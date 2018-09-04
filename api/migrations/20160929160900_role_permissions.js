exports.up = knex =>
  knex.schema
    .createTable('role', t => {
      t.string('name').primary();
      t.string('label');
    })
    .then(() =>
      knex('role')
        .insert([
          { name: 'administrator', label: 'Administrator' },
          { name: 'cards_administrator', label: 'Cards Administrator' },
          { name: 'anonymous', label: 'Anonymous' },
          { name: 'authenticated', label: 'Authenticated' },
          { name: 'owner', label: 'Owner' },
        ])
    )
    .then(() =>
      knex.schema.createTable('permission', t => {
        t.string('name').primary();
        t.string('label');
      })
    )
    .then(() =>
      knex('permission')
        .insert([
          { name: 'add_card', label: 'Add Card' },
          { name: 'get_card', label: 'Get Card' },
          { name: 'search_addresses', label: 'Search Addresses' },
          { name: 'get_cards', label: 'Get Cards' },
          { name: 'get_api', label: 'Get Api' },
          { name: 'search_card', label: 'Search Card' },
          { name: 'delete_card', label: 'Delete Card' },
          { name: 'update_card', label: 'Update Card' },
          { name: 'get_services', label: 'Get Services' },
          { name: 'get_user_service_preference', label: 'Get user service preference' },
        ])
    )
    .then(() =>
      knex.schema.createTable('role_permission', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('role').notNull().references('role.name');
        t.string('permission').notNull().references('permission.name');
      })
    )
    .then(() =>
      knex('role_permission')
        .insert([
          { role: 'administrator', permission: 'add_card' },
          { role: 'anonymous', permission: 'get_card' },
          { role: 'anonymous', permission: 'search_addresses' },
          { role: 'anonymous', permission: 'get_cards' },
          { role: 'anonymous', permission: 'get_api' },
          { role: 'anonymous', permission: 'search_card' },
          { role: 'owner', permission: 'delete_card' },
          { role: 'owner', permission: 'update_card' },
          { role: 'authenticated', permission: 'get_services' },
          { role: 'authenticated', permission: 'get_user_service_preference' },
        ])
    )
    .then(() =>
      knex.schema.createTable('user_role', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.uuid('user').notNull().references('user.id');
        t.string('role').notNull().references('role.name');
      })
    );

exports.down = knex =>
  knex.schema.dropTable('user_role')
    .then(() => knex.schema.dropTable('role_permission'))
    .then(() => knex.schema.dropTable('permission'))
    .then(() => knex.schema.dropTable('role'));
