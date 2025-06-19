import { SearchParameter } from 'app/core/base/parameters/searchParameter.entity';

export class GetPersonParameter extends SearchParameter {
    name?: string;
    surname?: string;
    // เพิ่ม property อื่นๆ สำหรับค้นหาได้ที่นี่ เช่น phone, n_id เป็นต้น
}
