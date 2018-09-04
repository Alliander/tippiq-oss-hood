exports.seed = knex =>
  knex('user_service_preference').insert([
    {
      user: '48181aa2-560a-11e5-a1d5-c7050c4109ab',
      service: '00000000-0000-0000-0000-000000000000',
      is_enabled: true,
      max_distance: null,
    },
    {
      user: '48181aa2-560a-11e5-a1d5-c7050c4109ab',
      service: '00000000-0000-0000-0000-000000000003',
      is_enabled: true,
      max_distance: null,
    },
  ]);
