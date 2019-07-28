import { Express, Response, Request } from 'express';
import { wrapError } from 'ew-internals';
import { getVaultFor, hasVaultFor } from './vault';
import { getValidator, filterStructure } from './dto-compiler';

import { ResultError, StringMap } from './type';

export class Result {
    public data?: any = null;
    public errors: ResultError[] = [];
    public status?: number = null;

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
    runtimeParameters: StringMap = {},
) => {
    controllers.forEach((controller: Function) => {
        if (!hasVaultFor(controller)) {
            return;
        }

        const { endpoint: rootEndpoint, methods } = getVaultFor(controller);
        if (_.isne(rootEndpoint) && _.ione(methods)) {
            Object.keys(methods).forEach((methodName: string) => {
                const methodRecord: StringMap = methods[methodName];

                const {
                    method,
                    fn,
                    endpoint = '',
                    bodyDTO,
                    outputDTO,
                } = methodRecord;
                if (!_.isne(method) && !_.isFunction(fn)) {
                    return;
                }

                app[method](
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
                                    result.data,
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
