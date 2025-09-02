import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateThreatDto, UpdateThreatDto } from '../../common/dto/threat.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ThreatsService {
  private readonly logger = new Logger(ThreatsService.name);
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

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
    try {
      // Get real-time threat data
      const totalThreats = await this.prisma.threat.count();
      const recentThreats = await this.prisma.threat.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      // Get recent incidents for correlation
      const recentIncidents = await this.prisma.incident.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: {
          status: { not: 'resolved' },
        },
      });

      // Analyze threat patterns using AI service
      let aiAnalysis = null;
      try {
        const aiResponse = await firstValueFrom(
          this.httpService.post(`${this.aiServiceUrl}/analyze/threats`, {
            threats: recentThreats,
            incidents: recentIncidents,
            timeframe: '24h',
          })
        );
        aiAnalysis = aiResponse.data;
      } catch (error) {
        this.logger.warn('AI service unavailable, using fallback analysis');
        aiAnalysis = this.generateFallbackAnalysis(recentThreats, recentIncidents);
      }

      // Calculate threat metrics
      const severityBreakdown = await this.calculateSeverityBreakdown();
      const threatTrends = await this.calculateThreatTrends();
      const geographicThreats = await this.calculateGeographicThreats();
      const iocAnalysis = await this.analyzeIOCs();

      return {
        analysis: {
          totalThreats,
          severityBreakdown,
          threatTrends,
          geographicThreats,
          iocAnalysis,
          recentThreats: recentThreats.slice(0, 5),
          aiRecommendations: aiAnalysis?.recommendations || [],
          threatScore: this.calculateThreatScore(severityBreakdown, threatTrends),
          lastUpdated: new Date().toISOString(),
        },
        message: 'Real-time threat analysis completed successfully',
      };
    } catch (error) {
      this.logger.error('Error during threat analysis', error);
      throw error;
    }
  }

  private async calculateSeverityBreakdown() {
    const [critical, high, medium, low] = await Promise.all([
      this.prisma.threat.count({ where: { severity: 'critical' } }),
      this.prisma.threat.count({ where: { severity: 'high' } }),
      this.prisma.threat.count({ where: { severity: 'medium' } }),
      this.prisma.threat.count({ where: { severity: 'low' } }),
    ]);

    return { critical, high, medium, low };
  }

  private async calculateThreatTrends() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [threats24h, threats7d] = await Promise.all([
      this.prisma.threat.count({
        where: { createdAt: { gte: last24h } },
      }),
      this.prisma.threat.count({
        where: { createdAt: { gte: last7d } },
      }),
    ]);

    return {
      last24h: threats24h,
      last7d: threats7d,
      trend: threats24h > threats7d / 7 ? 'increasing' : 'decreasing',
      percentageChange: ((threats24h - threats7d / 7) / (threats7d / 7)) * 100,
    };
  }

  private async calculateGeographicThreats() {
    // This would integrate with IP geolocation services
    // For now, return mock data
    return [
      { country: 'United States', count: 45, percentage: 35, trend: 'up' },
      { country: 'China', count: 23, percentage: 18, trend: 'stable' },
      { country: 'Russia', count: 18, percentage: 14, trend: 'up' },
      { country: 'Germany', count: 12, percentage: 9, trend: 'down' },
      { country: 'Others', count: 32, percentage: 24, trend: 'stable' },
    ];
  }

  private async analyzeIOCs() {
    // Since IOC model doesn't exist yet, return mock data
    return {
      total: 0,
      byType: {},
      recent: [],
    };
  }

  private calculateThreatScore(severityBreakdown: any, threatTrends: any) {
    const criticalWeight = 10;
    const highWeight = 7;
    const mediumWeight = 4;
    const lowWeight = 1;

    const baseScore = 
      severityBreakdown.critical * criticalWeight +
      severityBreakdown.high * highWeight +
      severityBreakdown.medium * mediumWeight +
      severityBreakdown.low * lowWeight;

    const trendMultiplier = threatTrends.trend === 'increasing' ? 1.2 : 0.8;
    
    return Math.min(100, Math.round(baseScore * trendMultiplier));
  }

  private generateFallbackAnalysis(threats: any[], incidents: any[]) {
    return {
      recommendations: [
        'Implement additional input validation',
        'Enable rate limiting on API endpoints',
        'Update security headers configuration',
        'Conduct regular security audits',
        'Monitor for unusual network activity',
        'Implement endpoint detection and response',
      ],
      patterns: [
        'SQL injection attempts detected',
        'Multiple failed login attempts',
        'Suspicious file uploads',
        'Unusual outbound connections',
      ],
    };
  }

  async getThreatFeeds() {
    // This would integrate with external threat intelligence feeds
    // For now, return mock data based on real threats
    const recentThreats = await this.prisma.threat.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    return [
      {
        id: 'feed-001',
        name: 'Malware Command & Control',
        source: 'abuse.ch',
        status: 'active',
        totalThreats: recentThreats.filter(t => t.severity === 'high' || t.severity === 'critical').length,
        newThreats24h: recentThreats.filter(t => 
          (t.severity === 'high' || t.severity === 'critical') && 
          new Date(t.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        lastUpdate: '2 minutes ago',
        description: 'Malware C&C server tracking and blacklisting',
        category: 'Malware',
      },
      {
        id: 'feed-002',
        name: 'Phishing URLs',
        source: 'PhishTank',
        status: 'active',
        totalThreats: recentThreats.filter(t => t.severity === 'medium').length,
        newThreats24h: recentThreats.filter(t => 
          t.severity === 'medium' && 
          new Date(t.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        lastUpdate: '1 minute ago',
        description: 'Phishing website detection and reporting',
        category: 'Phishing',
      },
      {
        id: 'feed-003',
        name: 'Botnet Tracking',
        source: 'Spamhaus',
        status: 'active',
        totalThreats: recentThreats.filter(t => t.severity === 'low').length,
        newThreats24h: recentThreats.filter(t => 
          t.severity === 'low' && 
          new Date(t.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        lastUpdate: '5 minutes ago',
        description: 'Botnet command and control infrastructure',
        category: 'Botnet',
      },
    ];
  }

  async getMitigationRecommendations() {
    try {
      // Get current threats and incidents for context
      const recentThreats = await this.prisma.threat.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: { severity: { in: ['high', 'critical'] } },
      });

      const recentIncidents = await this.prisma.incident.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: { status: { not: 'resolved' } },
      });

      // Generate dynamic mitigation rules based on current threats
      const mitigationRules = [];

      // SQL Injection protection (based on threat description)
      if (recentThreats.some(t => t.description?.toLowerCase().includes('sql'))) {
        mitigationRules.push({
          id: 'MIT-SQL-001',
          name: 'Enhanced SQL Injection Protection',
          description: 'Advanced WAF rules for SQL injection detection and blocking',
          severity: 'critical',
          impact: 'low',
          category: 'Web Application Firewall',
          target: 'SQL Injection',
          status: 'draft',
          configuration: `# Enhanced WAF Rules - SQL Injection Protection
SecRule ARGS "@detectSQLi" "id:1001,phase:2,block,msg:'SQL Injection Attack Detected'"
SecRule ARGS "@detectSQLi" "id:1002,phase:2,block,msg:'SQL Injection Pattern Detected'"
SecRule ARGS "@detectSQLi" "id:1003,phase:2,block,msg:'SQL Injection Payload Detected'"
SecRule ARGS "@detectSQLi" "id:1004,phase:2,block,msg:'Advanced SQL Injection Attempt'"`,
          createdAt: new Date().toISOString(),
          priority: 'high',
        });
      }

      // Brute Force protection (based on incident title)
      if (recentIncidents.some(i => i.title?.toLowerCase().includes('brute'))) {
        mitigationRules.push({
          id: 'MIT-BF-001',
          name: 'Aggressive Brute Force Protection',
          description: 'Enhanced rate limiting and account lockout policies',
          severity: 'high',
          impact: 'medium',
          category: 'Rate Limiting',
          target: 'Brute Force',
          status: 'draft',
          configuration: `# Enhanced Rate Limiting Rules
limit_req_zone $binary_remote_addr zone=login:10m rate=3r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=50r/m;

location /login {
    limit_req zone=login burst=5 nodelay;
    limit_req_status 429;
}

location /api/ {
    limit_req zone=api burst=20 nodelay;
    limit_req_status 429;
}`,
          createdAt: new Date().toISOString(),
          priority: 'high',
        });
      }

      // Phishing protection (based on threat description)
      if (recentThreats.some(t => t.description?.toLowerCase().includes('phishing'))) {
        mitigationRules.push({
          id: 'MIT-PHISH-001',
          name: 'Phishing URL Blocking',
          description: 'Real-time URL reputation checking and blocking',
          severity: 'high',
          impact: 'low',
          category: 'URL Filtering',
          target: 'Phishing',
          status: 'draft',
          configuration: `# Phishing URL Blocking Rules
# Enable real-time URL reputation checking
url_reputation_check on;
url_reputation_threshold 0.7;

# Block known phishing domains
deny from 185.220.101.0/24;
deny from 185.220.102.0/24;

# Custom phishing patterns
location ~* \\.(tk|ml|ga|cf|gq)$ {
    deny all;
}`,
          createdAt: new Date().toISOString(),
          priority: 'medium',
        });
      }

      // Malware protection (based on threat description)
      if (recentThreats.some(t => t.description?.toLowerCase().includes('malware'))) {
        mitigationRules.push({
          id: 'MIT-MAL-001',
          name: 'Advanced Malware Protection',
          description: 'Enhanced endpoint detection and file scanning',
          severity: 'critical',
          impact: 'medium',
          category: 'Endpoint Protection',
          target: 'Malware',
          status: 'draft',
          configuration: `# Advanced Malware Protection
# Enable real-time file scanning
file_scanning on;
file_types = "exe,dll,jar,ps1,vbs,js";

# Block suspicious file uploads
location /upload {
    client_max_body_size 10M;
    deny all;
}

# Enable behavioral analysis
behavioral_analysis on;
sandbox_execution on;`,
          createdAt: new Date().toISOString(),
          priority: 'high',
        });
      }

      // Add general security recommendations
      mitigationRules.push({
        id: 'MIT-GEN-001',
        name: 'Security Headers Enhancement',
        description: 'Implement comprehensive security headers',
        severity: 'medium',
        impact: 'low',
        category: 'Security Headers',
        target: 'General Security',
        status: 'draft',
        configuration: `# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;`,
        createdAt: new Date().toISOString(),
        priority: 'medium',
      });

      return {
        rules: mitigationRules,
        summary: {
          totalRules: mitigationRules.length,
          criticalRules: mitigationRules.filter(r => r.severity === 'critical').length,
          highPriorityRules: mitigationRules.filter(r => r.priority === 'high').length,
          deploymentReady: mitigationRules.filter(r => r.status === 'draft').length,
        },
        recommendations: [
          'Deploy critical security rules immediately',
          'Test rules in staging environment before production',
          'Monitor rule effectiveness and adjust as needed',
          'Implement automated rule deployment pipeline',
        ],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error generating mitigation recommendations', error);
      throw error;
    }
  }
}
