import {
    Endpoint,
    Post,
    BodyInput,
    Output,
    Result,
    InputContext,
} from '../../lib/msc';

import { DemoInputDTO } from './input.dto';
import { DemoOutputDTO } from './output.dto';

@Endpoint('/demo')
export class DemoController {
    @Post(':one/:two')
    @BodyInput(DemoInputDTO)
    @Output(DemoOutputDTO)
    public async getEntity(
        { type, entity },
        { body, runtime: { database } }: InputContext,
    ): Promise<Result> {
        const result = new Result();

        // use some service here

        result.data = {
            age: 20,
            name: 'Flynn',
            gender: 'male',
            type,
            entity,
        };

        return result;
    }
}
