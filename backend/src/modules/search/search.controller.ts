import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across all entities' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async globalSearch(@Query('q') query: string) {
    return this.searchService.globalSearch(query);
  }

  @Get('threats')
  @ApiOperation({ summary: 'Search threats' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Threat search results retrieved successfully' })
  async searchThreats(@Query('q') query: string) {
    return this.searchService.searchThreats(query);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Search incidents' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Incident search results retrieved successfully' })
  async searchIncidents(@Query('q') query: string) {
    return this.searchService.searchIncidents(query);
  }
}
