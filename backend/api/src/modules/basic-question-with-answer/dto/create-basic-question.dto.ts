import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBasicQuestionDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  options: string[];
}

export class UpdateBasicQuestionDto extends PartialType(CreateBasicQuestionDto) {}

export class BasicQuestionResponseDto {
  @ApiProperty({ type: [String] })
  options: string[];

  static fromEntity(entity: any): BasicQuestionResponseDto {
    return {
      options: entity.options ?? [],
    };
  }
}
