exports.up = knex =>
  knex.schema.createTable('user_place', t => { // eslint-disable-line max-statements
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNull().references('user.id');
    t.uuid('place_id').notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    t.unique(['user_id', 'place_id']);
  });

exports.down = knex =>
  knex.schema.dropTable('user_place');
