exports.up = knex =>
  knex.schema.createTable('tag', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('label');
  });

exports.down = knex =>
  knex.schema.dropTable('tag');
