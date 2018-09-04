/**
 * Tippiq Id JWT Token Passport Strategy.
 * @module auth/strategies/jwt-id
 */
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRepository } from '../../users/repositories';
import config from '../../../config';

const options = Object.freeze({
  issuer: config.tippiqIdJwtIssuer,
  audience: config.oAuth2ClientId,
  secretOrKey: config.tippiqIdPublicKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
});

const strategy = new Strategy(options, (jwtPayload, done) => {
  UserRepository.findById(jwtPayload.sub)
  .tap(user => {
    if (!user) {
      throw new Error('Incorrect or empty token user');
    }
  })
  .asCallback(done);
});

export default {
  strategy,
};
