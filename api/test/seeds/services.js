exports.seed = knex =>
  knex('service').insert([
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Service voor tests 1... niet weggooien',
      category: 'test',
      organization_id: '54e0be2e-560a-11e5-9f4d-039a76ea6f5c',
      short_description: 'test kaartjes',
      description: 'test kaartjes omschrijving',
      url: 'http://www.tippiq.nl',
      default_max_distance: 200000,
      is_enabled: true,
    },
    {
      id: '00000000-0000-0000-0001-000000000000',
      name: 'Service voor tests 2... niet weggooien',
      category: 'Alerts',
      organization_id: '54e0be2e-560a-11e5-9f4d-039a76ea6f5c',
      short_description: 'test kaartjes',
      description: 'test kaartjes omschrijving',
      url: 'http://www.tippiq.nl',
      default_max_distance: 200000,
      is_enabled: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Service voor tests 3... niet weggooien',
      category: 'test',
      organization_id: '54e0be2e-560a-11e5-9f4d-039a76ea6f5c',
      short_description: 'test kaartjes',
      description: 'test kaartjes omschrijving',
      url: 'http://www.tippiq.nl',
      default_max_distance: 200000,
      is_enabled: false,
    },
    {
      id: 'a33505d6-24b8-4e66-962d-d17dd28985e6',
    },
    {
      id: '275bbc24-7cf3-486a-9cf1-369b159b1b8f',
    },
    {
      id: '6e744ce4-ae4c-4880-a5a1-62d5a9d57b0f',
    },
    {
      id: 'ab364269-7807-485a-a0f9-906ae76fdf1f',
    },
    {
      id: 'bc5f2115-27d0-4732-b971-55cc0c11347c',
    },
    {
      id: 'eea1fdee-1557-403e-af35-46f58b2280ed',
    },
    {
      id: '0ee9584a-6fa6-4c37-b73c-294c7105f2b8',
    },
    {
      id: 'bbe654cf-18d4-4c6e-87a0-434f145b4557',
      name: 'Liander Storingen',
      category: 'Meldingen',
      organization_id: 'ddda4851-6194-4044-8fb3-9d2775b672d2',
      short_description: 'Gasstoringen',
      description: 'Omschrijving van de dienst',
      url: 'https://www.liander.nl/onderhoud-storingen',
      default_max_distance: 3000,
      is_enabled: true,
    },
    {
      id: 'a84e0c6b-41e0-47da-beeb-d27ee481d7e8',
    },
    {
      id: 'c66be133-19e5-4b52-88b6-04f8e5436e1f',
      name: 'Overheid',
      category: 'Werkzaamheden',
      organization_id: 'c198fe28-3353-4838-afe6-55e6942bc3bd',
      short_description: 'Bekendmakingen vanuit de overheid',
      description: 'Omschrijving van de dienst',
      url: 'https://data.overheid.nl',
      default_max_distance: 3000,
      is_enabled: true,
    },
    {
      id: '042c053c-bd67-4950-9ba7-aac75c1825e4',
    },
    {
      id: '17289813-db57-4364-ab67-45cffa93c94b',
    },
    {
      id: '80be821e-aa25-425c-8ee1-bfe6aa02c31d',
    },
    {
      id: 'd4459b40-1e47-4984-8337-52f9ddff9662',
    },
    {
      id: '9f9b0b24-fceb-4ba0-ae0c-a51658c5eeb6',
    },
    {
      id: '1a9b774c-8ea5-483a-a951-5f4d6ede7fa1',
    },
  ]);
