import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { GenerateReportDto } from '../../common/dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(generateReportDto: GenerateReportDto) {
    // Generate report content based on type
    let content = '';
    
    switch (generateReportDto.type) {
      case 'summary':
        content = await this.generateSummaryReport(generateReportDto.projectId);
        break;
      case 'comprehensive':
        content = await this.generateComprehensiveReport(generateReportDto.projectId);
        break;
      case 'detailed':
        content = await this.generateDetailedReport(generateReportDto.projectId);
        break;
      default:
        content = await this.generateSummaryReport(generateReportDto.projectId);
    }

    const report = await this.prisma.report.create({
      data: {
        title: generateReportDto.title,
        content: content,
      },
    });

    return {
      id: report.id,
      title: report.title,
      type: generateReportDto.type,
      message: 'Report generated successfully',
    };
  }

  async downloadReport(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return {
      id: report.id,
      title: report.title,
      content: report.content,
      createdAt: report.createdAt,
      downloadUrl: `/api/reports/${id}/content`,
    };
  }

  private async generateSummaryReport(projectId?: string) {
    const threatsCount = await this.prisma.threat.count();
    const incidentsCount = await this.prisma.incident.count();
    
    return `
# Security Summary Report

## Overview
- Total Threats: ${threatsCount}
- Total Incidents: ${incidentsCount}
- Generated: ${new Date().toISOString()}

## Key Findings
This is a summary report of the current security posture.
    `.trim();
  }

  private async generateComprehensiveReport(projectId?: string) {
    const threats = await this.prisma.threat.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    const incidents = await this.prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return `
# Comprehensive Security Report

## Executive Summary
This comprehensive security report provides detailed analysis of threats and incidents.

## Threats Analysis
${threats.map(threat => `- ${threat.title} (${threat.severity})`).join('\n')}

## Incidents Overview
${incidents.map(incident => `- ${incident.title} (${incident.status})`).join('\n')}

## Recommendations
1. Implement additional security measures
2. Regular security audits
3. Employee security training
4. Incident response planning

Generated: ${new Date().toISOString()}
    `.trim();
  }

  private async generateDetailedReport(projectId?: string) {
    const threats = await this.prisma.threat.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const incidents = await this.prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const severityBreakdown = await this.prisma.threat.groupBy({
      by: ['severity'],
      _count: {
        severity: true,
      },
    });

    return `
# Detailed Security Report

## Executive Summary
Comprehensive analysis of all security threats and incidents.

## Threats Analysis
### Severity Breakdown
${severityBreakdown.map(item => `- ${item.severity}: ${item._count.severity}`).join('\n')}

### Recent Threats
${threats.map(threat => `
**${threat.title}**
- Severity: ${threat.severity}
- Description: ${threat.description}
- Date: ${threat.createdAt.toISOString()}
`).join('\n')}

## Incidents Analysis
### Status Overview
${incidents.map(incident => `
**${incident.title}**
- Status: ${incident.status}
- Date: ${incident.createdAt.toISOString()}
`).join('\n')}

## Detailed Recommendations
1. **Immediate Actions**
   - Review all critical threats
   - Update security policies
   
2. **Short-term Goals**
   - Implement automated threat detection
   - Enhance incident response procedures
   
3. **Long-term Strategy**
   - Continuous security monitoring
   - Regular penetration testing

Generated: ${new Date().toISOString()}
    `.trim();
  }
}
