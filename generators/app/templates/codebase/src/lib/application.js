import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { Settings } from 'ew-internals';

import { Database } from '../database';
import { InterCom } from './intercom';

import attachHomeAPI from '../api/home';
import attachGraphQL from '../api/graphql';

export default class Application {
    static async make() {
        // logger.info('Initializing the application');

        const instance = new this();

        const app = express();
        const settings = new Settings();

        instance.attachErrorHandler(app);

        const host = await settings.get('network.host', 'localhost');
        const port = process.env.PORT || await settings.get('network.port', 3000);

        app.set('host', host);
        app.set('port', port);
        // increase the default parse depth of a query string and disable allowPrototypes
        // app.set('query parser', query => {
        //   return qs.parse(query, { allowPrototypes: false, depth: 10 });
        // });

        this.attachCORS(app, settings);

        app.use(helmet());
        app.use(express.json());
        // // turn on URL-encoded parser for REST services
        // app.use(
        //   express.urlencoded({
        //     extended: true,
        //   }),
        // );

        const database = new Database({
            url: await settings.get('database.url', ''),
        });
        await database.connect();
        if (__DEV__) {
            await database.migrate();
        }

        const intercom = new InterCom({
            url: await settings.get('intercom.url', ''),
        });
        await intercom.start();

        attachHomeAPI(app);
        attachGraphQL(app, { dataSources: { database, intercom } });

        instance.expressApplication = app;

        return instance;
    }

    attachErrorHandler(app) {
        // catching async unhandled rejections
        process
            .on('unhandledRejection', err => {
                logger.error('Unhandled rejection', err);
            })
            .on('uncaughtException', err => {
                logger.error('Uncaught exception', err);
            });

        // catching normal unhandled exceptions
        app.use((err, req, res, next) => {
            logger.error('Uncaught exception', err);
            res.send('Nasty error'); // todo: explain here
        });
    }

    static attachCORS(app, settings) {
        const parameters = {
            origin: (origin, cb) => {
                // allow requests with no origin, like mobile apps or curl requests
                if (!origin) {
                    return cb(null, true);
                }

                // get cors settings on each hit, to be able to change it at the run-time
                settings
                    .get('network.cors', null)
                    .then(corsSettings => {
                        const origins = _.isne(corsSettings)
                            ? corsSettings.split(',').map(x => x.trim())
                            : [];

                        let match = false;
                        if (_.iane(origins)) {
                            // we have CORS settings
                            match = origins.indexOf(origin) >= 0;
                        }

                        if (match) {
                            return cb(null, true);
                        } else {
                            return cb(new Error('CORS mismatch'), false); // todo: throw 403
                        }
                    })
                    .catch(error => {
                        logger.error('Error occurred when checking CORS', error);
                        return cb(new Error('CORS error'), false); // todo: throw 500
                    });
            },
        };

        app.use(cors(parameters));
    }

    async listen() {
        const port = this.expressApplication.get('port');
        const host = this.expressApplication.get('host');

        return new Promise(resolve => {
            this.server = this.expressApplication.listen({ port }, () => {
                logger.info(
                    `🚀 <%- applicationName %> is ready at http://${host}:${port}`,
                    !__TEST__,
                );
                resolve();
            });
        });
    }

    async launch() {
        await this.listen();
    }

    async shutdown() {
        if (this.server) {
            return new Promise(resolve => {
                this.server.close(resolve);
            });
        }
    }

    getExpress() {
        return this.expressApplication;
    }
}
