/**
 * Tippiq Hood JWT Token Passport Strategy.
 * @module auth/strategies/jwt-hood
 */
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserRepository } from '../../users/repositories';
import config from '../../../config';

const options = Object.freeze({
  issuer: config.jwtIssuer,
  audience: config.oAuth2ClientId,
  secretOrKey: config.tippiqHoodPublicKey,
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
