exports.up = knex =>
  knex.schema.createTable('object_image', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('object_type').notNull();
    t.uuid('object_id').notNull();
    t.string('key').notNull();
    t.uuid('image').references('image.id');
    t.unique(['object_id', 'key']);
  });

exports.down = knex =>
  knex.schema.dropTable('object_image');
