exports.up = knex =>
  knex.schema.createTable('image', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('url').notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  });

exports.down = knex =>
    knex.schema.dropTable('image');
