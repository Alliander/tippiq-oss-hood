/**
 * Module for the backend API.
 * @module api
 * @author Tippiq
 */
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import debugLogger from 'debug-logger';
import morgan from 'morgan';

import auth from './modules/auth';
import addresses from './modules/addresses';
import config from './modules/config';
import users from './modules/users';
import cards from './modules/cards';
import services from './modules/services';
import places from './modules/places';
import contact from './modules/contact';
import newsletter from './modules/newsletter';
import { jwtId, jwtHood } from './modules/auth/strategies';
import cacheControl from './common/cache-control';

const app = express();

export { app as default };

const accessLog = debugLogger('tippiq-hood:access-log');
app.use(morgan('combined', { stream: { write: accessLog.log } }));
/*
 TODO: replace with `app.use(cacheResponseDirective());` when it returns `this`
 import legacyExpires from 'express-legacy-expires';
 import cacheResponseDirective from 'express-cache-response-directive';
 */
app.use(cacheControl);

app.use(bodyParser.json());

app.use(passport.initialize());
passport.use('jwtId', jwtId.strategy);
passport.use('jwtHood', jwtHood.strategy);
app.use(auth.performTippiqIdAuthenticationLogic);
app.use(auth.performTippiqHoodAuthenticationLogic);

app.use('/addresses', addresses.routes);
app.use('/config', config.routes);
app.use('/users', users.routes);
app.use('/cards', cards.routes);
app.use('/services', services.routes);
app.use('/places', places.routes);
app.use('/contact', contact.routes);
app.use('/send-weekly-newsletter', newsletter.routes);
