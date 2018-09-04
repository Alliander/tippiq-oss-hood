exports.up = knex =>
  knex.schema.createTable('card_location', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('card').references('card.id');
    t.uuid('location').references('location.id');
  });

exports.down = knex =>
  knex.schema.dropTable('card_location');
