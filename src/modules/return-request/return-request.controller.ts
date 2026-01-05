import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { ReturnRequestService } from './return-request.service';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';

@ApiTags('Return Requests')
@Controller('return-requests')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReturnRequestController {
  constructor(private readonly returnRequestService: ReturnRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a return/exchange request' })
  create(@Request() req, @Body() createDto: CreateReturnRequestDto) {
    return this.returnRequestService.create(req.user.sub, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my return requests' })
  findAll(@Request() req) {
    return this.returnRequestService.findMyRequests(req.user.sub);
  }
}
