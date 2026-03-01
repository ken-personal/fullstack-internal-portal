import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
