import cors from 'cors';

const useCORS = (app, settings) => {
    app.use(cors({
        origin: (origin, cb) => {
            // allow requests with no origin, like mobile apps or curl requests
            if (!origin) {
                return cb(null, true);
            }

            // get cors settings on each hit, to be able to change it at the run-time
            settings
                .get('network.cors', null)
                .then(corsSettings => {
                    if (corsSettings === '*') {
                        return cb(null, true);
                    }

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
                    logger.error(
                        'Error occurred when checking CORS',
                        error,
                    );
                    return cb(new Error('CORS error'), false); // todo: throw 500
                });
        },
    }));
};

export default useCORS;
