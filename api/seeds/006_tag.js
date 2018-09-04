exports.seed = knex =>
  knex('tag').insert([
    {
      id: '91d06a42-5609-11e5-95fc-eb8758b3ab9c',
      label: 'Duurzaamheid',
    }, {
      id: 'a1d06a42-5609-11e5-95fc-eb8758b3ab9c',
      label: 'Meldingen',
    },
  ]);

