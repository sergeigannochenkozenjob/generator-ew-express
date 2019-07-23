import { Request, Response, Express } from 'express';
import { wrapError } from 'ew-internals';

const useHomeAPI = (app: Express) => {
    app.get(
        '/',
        wrapError(async (req: Request, res: Response) => {
            return res.status(200).send('Hello from <%- applicationName %>');
        }),
    );
};

export default useHomeAPI;
