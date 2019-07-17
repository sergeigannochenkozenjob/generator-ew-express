import { wrapError } from 'ew-internals';

const useHomeAPI = app => {
    app.get(
        '/',
        wrapError(async (req, res) => {
            res.status(200).send('Hello from <%- applicationName %>');
        }),
    );
};

export default useHomeAPI;
