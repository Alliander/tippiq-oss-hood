exports.seed = knex =>
  knex('user')
    .insert([
      {
        id: '48181aa2-560a-11e5-a1d5-c7050c4109ab',
        name: 'Test Administrator',
      }, {
        id: '42181aa2-560a-11e5-a1d5-c7050c4109ac',
        name: 'Test User',
      },
    ]);
