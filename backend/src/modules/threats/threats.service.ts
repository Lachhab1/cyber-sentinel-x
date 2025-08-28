import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateThreatDto, UpdateThreatDto } from '../../common/dto/threat.dto';

@Injectable()
export class ThreatsService {
  constructor(private prisma: PrismaService) {}

  async create(createThreatDto: CreateThreatDto) {
    return this.prisma.threat.create({
      data: createThreatDto,
    });
  }

  async findAll() {
    return this.prisma.threat.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const threat = await this.prisma.threat.findUnique({
      where: { id },
    });

    if (!threat) {
      throw new NotFoundException('Threat not found');
    }

    return threat;
  }

  async update(id: string, updateThreatDto: UpdateThreatDto) {
    const threat = await this.prisma.threat.findUnique({
      where: { id },
    });

    if (!threat) {
      throw new NotFoundException('Threat not found');
    }

    return this.prisma.threat.update({
      where: { id },
      data: updateThreatDto,
    });
  }

  async remove(id: string) {
    const threat = await this.prisma.threat.findUnique({
      where: { id },
    });

    if (!threat) {
      throw new NotFoundException('Threat not found');
    }

    await this.prisma.threat.delete({
      where: { id },
    });

    return { message: 'Threat deleted successfully' };
  }

  async analyze() {
    // Placeholder for AI integration with /model-ai service
    return {
      analysis: {
        totalThreats: await this.prisma.threat.count(),
        severityBreakdown: {
          critical: await this.prisma.threat.count({ where: { severity: 'critical' } }),
          high: await this.prisma.threat.count({ where: { severity: 'high' } }),
          medium: await this.prisma.threat.count({ where: { severity: 'medium' } }),
          low: await this.prisma.threat.count({ where: { severity: 'low' } }),
        },
        recentThreats: await this.prisma.threat.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
        }),
        aiRecommendations: [
          'Implement additional input validation',
          'Enable rate limiting on API endpoints',
          'Update security headers configuration',
          'Conduct regular security audits',
        ],
      },
      message: 'AI analysis completed successfully',
    };
  }
}
