import { PartialType } from '@nestjs/mapped-types';
import { CreateGetwayDto } from './create-getway.dto';

export class UpdateGetwayDto extends PartialType(CreateGetwayDto) {}
