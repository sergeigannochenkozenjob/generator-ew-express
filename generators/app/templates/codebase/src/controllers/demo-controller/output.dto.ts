import { DTO, Attribute } from '../../lib/msc';

@DTO()
export class DemoOutputDTO {
    @Attribute({ required: true, type: 'string' })
    public name: string;

    @Attribute({ required: false, type: 'number' })
    public age: number;
}
