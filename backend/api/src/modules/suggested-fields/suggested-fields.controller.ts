import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SuggestedFieldsService } from './suggested-fields.service';

@Controller('suggested-fields')
export class SuggestedFieldsController {
  constructor(private readonly service: SuggestedFieldsService) {}

  @Post()
  create(@Body() body) {
    return this.service.createSuggestedField(body);
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.service.approveSuggestedField(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.rejectSuggestedField(id);
  }

  @Get('pending/:userId')
  getPending(@Param('userId') userId: string) {
    return this.service.getPendingSuggestedFields(userId);
  }
}
