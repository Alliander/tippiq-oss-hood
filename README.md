# Tippiq Hood OSS

*Update 03-09-2017*: This repository is now published as open source software under the GPL 3 License (see the LICENSE file).

*Warning*: Please take the appropriate security measures before running this software in production.

Tippiq Hood
===========

### Installation

**Prerequisites**
* Ruby, should come preinstalled on your Mac
* [Homebrew](http://http://brew.sh/)
* [Git](http://git-scm.com/), `brew install git`
* [PostgreSQL](https://github.com/PostgresApp/PostgresApp/releases/download/9.5.5/Postgres-9.5.5.zip), do not install via Homebrew or use version 9.6 as that causes the migrations to fail
* Add `export PATH=$PATH:/Applications/Postgres.app/Contents/Versions/latest/bin` to your `~/.bash_profile` and `source ~/.bash_profile`. Doing `which psql` should report the installation
* [Node.js](https://nodejs.org/), `brew install homebrew/versions/node6-lts`, do not use v7 as some dependencies are incompatible
* `npm install -g knex`, for doing the database migrations

**Install dependencies**

    npm install

**Local database**

    psql -c "create user tippiq_hood with password 'tippiq_hood';"

    psql -c "ALTER USER tippiq_hood WITH SUPERUSER"

    createdb -e -O tippiq_hood tippiq_hood

### Development

    export TIPPIQ_HOOD_DATABASE_URL='postgresql://tippiq_hood:tippiq_hood@localhost:5432/tippiq_hood?ssl=false'

    npm run dev

Open [localhost:3007/styleguide](http://localhost:3007/styleguide) to verify

### Seed data

    knex seed:run

### Production

    npm run prod

### Testing

    npm test:...
