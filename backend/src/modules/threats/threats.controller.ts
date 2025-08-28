import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThreatsService } from './threats.service';
import { CreateThreatDto, UpdateThreatDto } from '../../common/dto/threat.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Threats')
@Controller('threats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ThreatsController {
  constructor(private readonly threatsService: ThreatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new threat' })
  @ApiResponse({ status: 201, description: 'Threat created successfully' })
  async create(@Body() createThreatDto: CreateThreatDto) {
    return this.threatsService.create(createThreatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all threats' })
  @ApiResponse({ status: 200, description: 'Threats retrieved successfully' })
  async findAll() {
    return this.threatsService.findAll();
  }

  @Get('analysis')
  @ApiOperation({ summary: 'Get AI threat analysis' })
  @ApiResponse({ status: 200, description: 'Analysis completed successfully' })
  async analyze() {
    return this.threatsService.analyze();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get threat by ID' })
  @ApiResponse({ status: 200, description: 'Threat retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Threat not found' })
  async findOne(@Param('id') id: string) {
    return this.threatsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update threat' })
  @ApiResponse({ status: 200, description: 'Threat updated successfully' })
  @ApiResponse({ status: 404, description: 'Threat not found' })
  async update(
    @Param('id') id: string,
    @Body() updateThreatDto: UpdateThreatDto,
  ) {
    return this.threatsService.update(id, updateThreatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete threat' })
  @ApiResponse({ status: 200, description: 'Threat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Threat not found' })
  async remove(@Param('id') id: string) {
    return this.threatsService.remove(id);
  }
}
