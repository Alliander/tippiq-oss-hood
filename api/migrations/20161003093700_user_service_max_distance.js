exports.up = knex =>
  knex.schema.raw('create view "user_service_max_distance" as ?', [
    knex
      .select([
        'user.id as user',
        'service.id as service',
        knex
          .raw(
            'coalesce("user_service_preference"."max_distance",' +
            'coalesce("service"."default_max_distance",\'infinity\')) ' +
            'as "max_distance"'
          ),
        knex.raw('coalesce("user_service_preference"."is_enabled", true) and' +
          ' "service"."is_enabled" as "is_enabled"'),
      ])
      .from('user')
      .crossJoin('service')
      .leftJoin('user_service_preference', function join() {
        this
          .on('user_service_preference.service', 'service.id')
          .andOn('user_service_preference.user', 'user.id');
      }),
  ]);

exports.down = knex =>
  knex.schema.raw('drop view "user_service_max_distance"');
