import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { PersonEntity } from 'src/person/domain/entities/person.entity';

@Schema()
export class Person extends PersonEntity {}

export const PersonSchema = SchemaFactory.createForClass(Person);
