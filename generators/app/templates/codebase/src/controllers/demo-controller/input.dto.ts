import { DTO, Attribute } from '../../lib/msc';

@DTO()
class TSDTO {
    @Attribute({ required: false, type: 'boolean' })
    public yesNo: boolean;
}

@DTO()
class IndexDTO {
    @Attribute({ required: true, type: TSDTO })
    public ts: object;
}

@DTO()
export class DemoInputDTO {
    @Attribute({ required: true, type: IndexDTO })
    public index: object;

    @Attribute({ required: true, type: [IndexDTO] })
    public indexAr: object;

    @Attribute({ required: false, type: 'number' })
    public age: number;
}
