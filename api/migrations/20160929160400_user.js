exports.up = knex =>
  knex.schema.createTable('user', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').nullable();
    t.boolean('email_notifications_enabled').notNull().default(false);
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  });

exports.down = knex =>
  knex.schema.dropTable('user');
