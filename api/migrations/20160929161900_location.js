exports.up = (knex, Promise) =>
  Promise.all([
    knex.raw('CREATE EXTENSION IF NOT EXISTS postgis;'),
    knex.schema.createTable('location', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('type').nullable();
      t.specificType('geometry', 'geometry').nullable();
      t.string('nr').nullable();
      t.string('addition').nullable();
      t.string('letter').nullable();
      t.string('street_name').nullable();
      t.string('zipcode_letters').nullable();
      t.string('zipcode_digits').nullable();
      t.string('city_name').nullable();
      t.string('municipality_name').nullable();
      t.string('province_name').nullable();
      t.string('building_type').nullable();
      t.index(['geometry'], 'location_geometry', 'gist');
    }),
  ]);

exports.down = knex =>
  knex.schema.dropTable('location');
