exports.up = knex =>
  knex.schema.createTable('card_tag', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('card').references('card.id');
    t.uuid('tag').references('tag.id');
  });

exports.down = knex =>
  knex.schema.dropTable('card_tag');
