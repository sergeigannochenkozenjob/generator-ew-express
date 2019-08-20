import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import ConnectionManager from '../database/connection-manager';

export type PropertyDescriptor = TypedPropertyDescriptor<
    (params: any) => Promise<any>
> & { initializer?: Function } & { value?: Function };

export interface InputContext {
    req: Request;
    res: Response;
    body: any;
    headers: IncomingHttpHeaders;
    runtime: RuntimeParameters;
}

export interface ResultError {
    message?: string;
    code: string;
    type?: string;
}

export interface Result {
    data?: any;
    errors: ResultError[];
    status?: number;
}

export interface RuntimeParameters extends StringMap {
    connectionManager: Nullable<ConnectionManager>;
}

export interface DTOType extends GenericClass {}

export type DTOAttributeType = DTOType | 'string' | 'number' | 'boolean';

interface MethodRecordCallbackContext {
    req: Request;
    res: Response;
    body: any;
    headers: IncomingHttpHeaders;
    runtime: RuntimeParameters;
}

export interface MethodRecord extends StringMap {
    method: string;
    endpoint: string;
    fn: (params: StringMap, context: MethodRecordCallbackContext) => void;
    bodyDTO: DTOType;
    outputDTO: DTOType;
}

export interface VaultRecord extends StringMap {}

export interface APIVaultRecord extends VaultRecord {
    endpoint: string;
    methods: StringMap<MethodRecord>;
}

export interface DTORecordParameter {
    required: boolean;
    type: DTOAttributeType | DTOAttributeType[];
}

export interface DTORecord {
    params: DTORecordParameter;
}

export interface DTOVaultRecord extends VaultRecord {
    isDTO: boolean;
    attributes: StringMap<DTORecord>;
}
