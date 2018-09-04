exports.up = (knex) =>
  knex.schema.table('user', t => {
    t.timestamp('email_last_sent_at').notNullable().defaultTo('epoch');
  }).then(() => knex.raw('CREATE INDEX CONCURRENTLY user_email_notifications_enabled_email_last_sent_at_index ON public.user(email_last_sent_at) WHERE email_notifications_enabled IS TRUE'));

exports.down = (knex) =>
  knex.schema.table('user', t => {
    t.dropColumn('email_last_sent_at');
  }).then(() => knex.raw('DROP INDEX IF EXISTS user_email_notifications_enabled_email_last_sent_at_index'));

exports.config = {
  transaction: false, // CREATE INDEX CONCURRENTLY does not work inside a transaction
};
