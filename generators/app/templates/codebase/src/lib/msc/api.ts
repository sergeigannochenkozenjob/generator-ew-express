import { Express, Response, Request } from 'express';
// @ts-ignore
import { wrapError } from 'ew-internals';
import { getVaultFor, hasVaultFor } from './vault';
import { getValidator, filterStructure } from './dto-compiler';

import { RuntimeParameters, ResultError, APIVaultRecord } from './type';

export class Result {
    public data?: StringMap = {};
    public errors: ResultError[] = [];
    public status?: Nullable<number> = null;

    public toJSON(): object {
        return {
            data: this.data,
            errors: this.errors,
        };
    }
}

export const ERROR_INTERNAL = 'internal';
export const ERROR_REQUEST = 'request';

export const useMSC = (
    app: Express,
    controllers: Function[],
    runtimeParameters: RuntimeParameters = { connectionManager: null },
) => {
    controllers.forEach((controller: Function) => {
        if (!hasVaultFor(controller)) {
            return;
        }

        const { endpoint: rootEndpoint, methods } = getVaultFor(
            controller,
        ) as APIVaultRecord;
        if (_.isStringNotEmpty(rootEndpoint) && _.isObjectNotEmpty(methods)) {
            Object.keys(methods).forEach((methodName: string) => {
                const methodRecord = methods[methodName];

                const {
                    method,
                    fn,
                    endpoint = '',
                    bodyDTO,
                    outputDTO,
                } = methodRecord;
                if (!_.isStringNotEmpty(method) && !_.isFunction(fn)) {
                    return;
                }

                let appFunction: Nullable<Function> = null;
                if (method === 'get') {
                    appFunction = app.get;
                } else if (method === 'post') {
                    appFunction = app.post;
                } else if (method === 'put') {
                    appFunction = app.put;
                } else if (method === 'patch') {
                    appFunction = app.patch;
                } else if (method === 'delete') {
                    appFunction = app.delete;
                }

                if (!appFunction) {
                    throw new Error(
                        `Unsupported method produced by a decorator: ${method}`,
                    );
                }

                appFunction(
                    `${rootEndpoint}/${endpoint}`,
                    wrapError(async (req: Request, res: Response) => {
                        const errors: ResultError[] = [];
                        if (bodyDTO) {
                            const validator = getValidator(bodyDTO);
                            if (validator) {
                                try {
                                    // @ts-ignore
                                    await validator.validate(req.body, {
                                        abortEarly: false,
                                    });
                                    req.body = filterStructure(
                                        req.body,
                                        bodyDTO,
                                    );
                                } catch (e) {
                                    e.inner.forEach((error: Error) => {
                                        errors.push({
                                            message: error.message,
                                            code: 'validation',
                                            type: ERROR_REQUEST,
                                        });
                                    });
                                }
                            }
                        }

                        let result = null;
                        if (errors.length) {
                            result = new Result();
                            result.errors = errors;
                        } else {
                            result = await fn(req.params || {}, {
                                req,
                                res,
                                body: req.body,
                                headers: req.headers,
                                runtime: runtimeParameters,
                            });
                        }

                        let status = 200;
                        if (result instanceof Result) {
                            if (result.status) {
                                // eslint-disable-next-line prefer-destructuring
                                status = result.status;
                            } else if (
                                result.errors.find(
                                    error => error.type === ERROR_INTERNAL,
                                )
                            ) {
                                status = 500;
                            } else if (
                                result.errors.find(
                                    error => error.type === ERROR_REQUEST,
                                )
                            ) {
                                status = 400;
                            }

                            if (outputDTO) {
                                result.data = filterStructure(
                                    result.data || [],
                                    outputDTO,
                                );
                            }
                        }
                        res.status(status);

                        const headers = res.getHeaders();
                        if (!('Content-Type' in headers)) {
                            res.header('Content-Type', 'application/json');
                        }

                        return res.send(JSON.stringify(result));
                    }),
                );
            });
        }
    });
};
