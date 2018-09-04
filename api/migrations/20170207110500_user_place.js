exports.up = (knex, Promise) => Promise.all([
  knex.schema.table('user_place', t => {
    t.boolean('email_notifications_enabled').notNull().default(false);
    t.timestamp('email_last_sent_at').notNullable().defaultTo('epoch');
    t.dropForeign('user_id');
  }),
  knex.schema.table('user', t => {
    t.dropColumn('email_notifications_enabled');
    t.dropColumn('email_last_sent_at');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.table('user_place', t => {
    t.dropColumn('email_notifications_enabled');
    t.dropColumn('email_last_sent_at');
    t.foreign('user_id').references('user.id');
  }),
  knex.schema.table('user', t => {
    t.boolean('email_notifications_enabled').notNull().default(false);
    t.timestamp('email_last_sent_at').notNullable().defaultTo('epoch');
  }),
]);
