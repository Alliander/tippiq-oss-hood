exports.up = knex =>
  knex.raw('CREATE INDEX CONCURRENTLY user_place_email_notifications_enabled_email_last_sent_at_index ON public.user_place(email_last_sent_at) WHERE email_notifications_enabled IS TRUE');

exports.down = knex =>
  knex.raw('DROP INDEX IF EXISTS user_place_email_notifications_enabled_email_last_sent_at_index');

exports.config = {
  transaction: false, // CREATE INDEX CONCURRENTLY does not work inside a transaction
};
