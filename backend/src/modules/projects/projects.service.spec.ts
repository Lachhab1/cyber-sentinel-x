import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../../database/prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
      };
      const userId = 'user123';
      const mockProject = {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        ownerId: userId,
        owner: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.project.create.mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto, userId);

      expect(result).toEqual(mockProject);
      expect(mockPrismaService.project.create).toHaveBeenCalledWith({
        data: {
          ...createProjectDto,
          ownerId: userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all projects for a user', async () => {
      const userId = 'user123';
      const mockProjects = [
        {
          id: '1',
          name: 'Test Project',
          description: 'Test Description',
          ownerId: userId,
          owner: {
            id: userId,
            email: 'test@example.com',
            displayName: 'Test User',
          },
          incidents: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockProjects);
      expect(mockPrismaService.project.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
          incidents: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a project by id for the owner', async () => {
      const projectId = '1';
      const userId = 'user123';
      const mockProject = {
        id: projectId,
        name: 'Test Project',
        description: 'Test Description',
        ownerId: userId,
        owner: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
        },
        incidents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

      const result = await service.findOne(projectId, userId);

      expect(result).toEqual(mockProject);
      expect(mockPrismaService.project.findUnique).toHaveBeenCalledWith({
        where: { id: projectId },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
          incidents: true,
        },
      });
    });

    it('should throw NotFoundException when project not found', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999', 'user123')).rejects.toThrow('Project not found');
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      const mockProject = {
        id: '1',
        ownerId: 'owner123',
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);

      await expect(service.findOne('1', 'user123')).rejects.toThrow('Access denied');
    });
  });

  describe('update', () => {
    it('should update a project for the owner', async () => {
      const projectId = '1';
      const userId = 'user123';
      const updateData = { name: 'Updated Project' };
      const mockProject = {
        id: projectId,
        ownerId: userId,
      };
      const mockUpdatedProject = {
        id: projectId,
        name: 'Updated Project',
        ownerId: userId,
        owner: {
          id: userId,
          email: 'test@example.com',
          displayName: 'Test User',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);
      mockPrismaService.project.update.mockResolvedValue(mockUpdatedProject);

      const result = await service.update(projectId, updateData, userId);

      expect(result).toEqual(mockUpdatedProject);
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: projectId },
        data: updateData,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a project for the owner', async () => {
      const projectId = '1';
      const userId = 'user123';
      const mockProject = {
        id: projectId,
        ownerId: userId,
      };

      mockPrismaService.project.findUnique.mockResolvedValue(mockProject);
      mockPrismaService.project.delete.mockResolvedValue({});

      const result = await service.remove(projectId, userId);

      expect(result).toEqual({ message: 'Project deleted successfully' });
      expect(mockPrismaService.project.delete).toHaveBeenCalledWith({
        where: { id: projectId },
      });
    });
  });
});
