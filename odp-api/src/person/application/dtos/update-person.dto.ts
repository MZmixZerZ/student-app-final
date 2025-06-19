import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePersonDto {
  @ApiPropertyOptional({ description: 'National_ID' })
  @IsString()
  @IsOptional()
  n_id: string;

  @ApiPropertyOptional({ description: 'First Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'Last Name' })
  @IsString()
  @IsOptional()
  surname: string;

  @ApiPropertyOptional({ description: 'date-of-birth' })
  @IsString()
  @IsOptional()
  dob: string;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiPropertyOptional({ description: 'Citizenship' })
  @IsString()
  @IsOptional()
  citizen: string;

  @ApiPropertyOptional({ description: 'Nationality' })
  @IsString()
  @IsOptional()
  nationality: string;

  @ApiPropertyOptional({ description: 'Religion' })
  @IsString()
  @IsOptional()
  religion: string;

  @ApiPropertyOptional({ description: 'Phone Number' })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsString()
  @IsOptional()
  address: string;


}