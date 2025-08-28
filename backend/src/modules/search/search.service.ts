import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string) {
    const [threats, incidents, projects] = await Promise.all([
      this.searchThreats(query),
      this.searchIncidents(query),
      this.searchProjects(query),
    ]);

    return {
      threats,
      incidents,
      projects,
      totalResults: threats.length + incidents.length + projects.length,
    };
  }

  async searchThreats(query: string) {
    return this.prisma.threat.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { severity: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchIncidents(query: string) {
    return this.prisma.incident.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchProjects(query: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
