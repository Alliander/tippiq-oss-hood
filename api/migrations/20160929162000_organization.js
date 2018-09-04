exports.up = knex =>
  knex.schema.createTable('organization', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name');
    t.text('bio');
    t.string('email');
    t.string('phone');
    t.uuid('location').references('location.id');
    t.boolean('hide_location');
    t.string('website');
    t.boolean('is_partner').notNull().defaultTo(true);
    t.float('partner_level').nullable();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
  });

exports.down = knex =>
  knex.schema.dropTable('organization');

