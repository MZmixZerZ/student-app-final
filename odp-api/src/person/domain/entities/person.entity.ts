import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class PersonEntity {
  @Expose({ name: 'id' })
  @Transform(({ obj }) => (obj._id ? obj._id.toString() : null), {
    toClassOnly: true,
  })
  public id: string;

  @Expose()
  @Prop({ type: String, unique: true, required: true })
  n_id: string;

  @Expose()
  @Prop({ type: String, required: true })
  name: string;

  @Expose()
  @Prop({ type: String, required: true })
  surname: string;
  
  @Expose()
  @Prop({ type: Date, required: true })
  dob: Date;

  @Expose()
  @Prop({ type: String, required: true })
  gender: string;

  @Expose()
  @Prop({ type: String, required: true })
  citizen: string;

  // เพิ่ม property สำหรับ audit log
  @Expose()
  @Prop({ type: Object })
  createdBy: any;

  @Expose()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  // เพิ่ม property สำหรับการอัปเดต
  @Expose()
  @Prop({ type: Object })
  updatedBy: any;

  @Expose()
  @Prop({ type: Date })
  updatedAt: Date;
}
