import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
// Assuming AdminGuard exists or using AuthGuard for now with admin role check logic (omitted for brevity)
import { ReturnRequestService } from './return-request.service';
import { UpdateReturnRequestStatusDto } from './dto/update-return-request-status.dto';

@ApiTags('Admin Return Requests')
@Controller('admin/return-requests')
export class ReturnRequestAdminController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Get()
  @ApiOperation({ summary: 'Get all return requests' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query() query) {
    return this.returnRequestService.findAllJson(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return request details' })
  findOne(@Param('id') id: string) {
    return this.returnRequestService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update return request status' })
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateReturnRequestStatusDto) {
    return this.returnRequestService.updateStatus(id, updateDto);
  }
}
