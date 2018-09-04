exports.up = knex =>
  knex.schema.createTable('service', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').notNull();
    t.string('category').notNull();
    t.uuid('organization_id').notNull().references('organization.id');
    t.text('description', 'longtext');
    t.string('url', 255);
    t.float('default_max_distance').notNullable().defaultTo(0);
    t.string('short_description');
    t.boolean('is_enabled').notNullable().defaultTo(true);
  });

exports.down = knex =>
  knex.schema.dropTable('service');
