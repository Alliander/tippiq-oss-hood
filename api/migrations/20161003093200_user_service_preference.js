exports.up = knex =>
  knex.schema.createTable('user_service_preference', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user').notNull().references('user.id');
    t.uuid('service').notNull().references('service.id');
    t.boolean('is_enabled').notNullable().defaultTo(true);
    t.float('max_distance').nullable();
    t.unique(['service', 'user']);
  });


exports.down = knex =>
  knex.schema.dropTable('user_service_preference');
