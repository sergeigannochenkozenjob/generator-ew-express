const useErrorHandler = (app) => {
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
};

export default useErrorHandler;
