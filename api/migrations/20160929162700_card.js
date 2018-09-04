exports.up = knex =>
  knex.schema.createTable('card', t => { // eslint-disable-line max-statements
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('external_id').unique();
    t.uuid('parent_id').nullable().references('card.id');
    t.text('title');
    t.text('description');
    t.dateTime('start_date');
    t.dateTime('end_date');
    t.dateTime('published_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('expires_at');
    t.uuid('author_id').references('organization.id');
    t.uuid('publisher_id').references('organization.id');
    t.uuid('owner').notNull().references('user.id');
    t.string('document_type');
    t.json('document');
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    t.uuid('service').notNull().references('service.id');
    t.index(
      [
        knex.raw('coalesce("published_at",\'-infinity\')'),
        knex.raw('coalesce("expires_at",\'infinity\')'),
      ], 'card_published_at_expires_at'
    );
  });

exports.down = knex =>
  knex.schema.dropTable('card');
