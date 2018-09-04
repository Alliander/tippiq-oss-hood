exports.seed = knex =>
  knex('user_role').insert([
    {
      user: '48181aa2-560a-11e5-a1d5-c7050c4109ab',
      role: 'administrator',
    },
  ]);
