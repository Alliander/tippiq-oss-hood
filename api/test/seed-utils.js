/**
 * Utility functions for seeding
 * @module common/seed-utils
 */
import BPromise from 'bluebird';
import debugLogger from 'debug-logger';

import testUserPlaces from './seeds/user_places';
import { UserPlaceRepository } from '../modules/places/repositories';

const debug = debugLogger('tippiq-hood:test:seed-utils');
/*

 import fs from 'fs-promise';

 import testUsers from '../seeds/users';
 import testUserRoles from '../seeds/user-roles';
 import { UserRepository } from '../modules/users/repositories';
 import { UserRoleRepository } from '../modules/users/repositories';

 /**
 * Insert test users.
 * @function insertTestUsers
 * @returns {undefined}
 *
 export function insertTestUsers() {
 return BPromise.all(testUsers.map(user => UserRepository.create(user, { method: 'insert' })));
 }

 /**
 * Remove test users.
 * @function removeTestUsers
 * @returns {undefined}
 *
 export function removeTestUsers() {
 return BPromise.all(testUsers.map(user => UserRepository.deleteById(user.id)));
 }

 /**
 * Insert test user roles.
 * @function insertTestUserRoles
 * @returns {undefined}
 *
 export function insertTestUserRoles() {
 return BPromise.all(
 testUserRoles.map(userRole => UserRoleRepository.create(userRole, { method: 'insert' }))
 );
 }

 /**
 * Remove test user roles.
 * @function removeTestUserRoles
 * @returns {undefined}
 *
 export function removeTestUserRoles() {
 return BPromise.all(testUserRoles.map(userRole => UserRoleRepository.deleteById(userRole.id)));
 }
 */

/**
 * Insert test UserPlaces.
 * @function insertTestUserPlaces
 * @returns {undefined}
 */
export function insertTestUserPlaces() {
  return BPromise.all(testUserPlaces.map(userPlace =>
    UserPlaceRepository.create(userPlace, { method: 'insert' })));
}

/**
 * Remove test UserPlaces.
 * @function removeTestUserPlaces
 * @returns {undefined}
 */
export function removeTestUserPlaces() {
  return BPromise.all(testUserPlaces.map(userPlace => UserPlaceRepository.deleteById(userPlace.id)))
    .catch(e => {
      debug('removeLocationToken', e.message);
    });
}

/**
 * Remove test data
 * @function removeTestData
 * @returns {undefined}
 */
export function removeTestData() {
  return removeTestUserPlaces();
}


/**
 * Insert test data.
 * @function insertTestData
 * @returns {undefined}
 */
export function insertTestData() {
  return removeTestData()
    .then(insertTestUserPlaces);
}

