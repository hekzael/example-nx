import { PlatformPermissionOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/platform-permission.orm-entity';
import { PlatformRolePermissionOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/platform-role-permission.orm-entity';
import { PlatformRoleOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/platform-role.orm-entity';
import { UserPlatformRoleOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/user-platform-role.orm-entity';
import { UserOrmEntity } from '@identity/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { CryptoPasswordHashingAdapter } from '@identity/infrastructure/security/crypto/crypto-password-hashing.adapter';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ProjectEnvironmentOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-environment.orm-entity';
import { ProjectModuleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-module.orm-entity';
import { ProjectRoleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project-role.orm-entity';
import { ProjectOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/project.orm-entity';
import { DataSource } from 'typeorm';

type SeedEnvironment = {
  code: string;
  name: string;
  priority: number;
};

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BootstrapService.name);
  private readonly passwordHashing = new CryptoPasswordHashingAdapter();
  private bootstrapped = false;

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.bootstrapped) {
      return;
    }
    this.bootstrapped = true;

    const enabled = process.env.BOOTSTRAP_ENABLED !== 'false';
    if (!enabled) {
      this.logger.log('Bootstrapping disabled');
      return;
    }

    await this.seedUsers();
    await this.seedProjectDefaults();
  }

  private async seedUsers(): Promise<void> {
    const userRepo = this.dataSource.getRepository(UserOrmEntity);
    const platformRoleRepo = this.dataSource.getRepository(
      PlatformRoleOrmEntity,
    );
    const platformPermissionRepo = this.dataSource.getRepository(
      PlatformPermissionOrmEntity,
    );
    const platformRolePermissionRepo = this.dataSource.getRepository(
      PlatformRolePermissionOrmEntity,
    );
    const userPlatformRoleRepo = this.dataSource.getRepository(
      UserPlatformRoleOrmEntity,
    );

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@local.dev';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin12345678';
    const adminDisplayName = process.env.DEFAULT_ADMIN_DISPLAY_NAME || 'Admin';

    const testEmail = process.env.DEFAULT_TEST_EMAIL || 'test@local.dev';
    const testPassword = process.env.DEFAULT_TEST_PASSWORD || 'Test12345678';
    const testDisplayName =
      process.env.DEFAULT_TEST_DISPLAY_NAME || 'Test User';

    let admin = await userRepo.findOne({
      where: { email: adminEmail },
    });
    if (!admin) {
      const newAdmin = new UserOrmEntity();
      newAdmin.email = adminEmail;
      newAdmin.displayName = adminDisplayName;
      newAdmin.passwordHash = await this.passwordHashing.hash(adminPassword);
      newAdmin.isActive = true;
      newAdmin.requirePasswordChange = true;
      newAdmin.emailVerifiedAt = new Date();
      admin = await userRepo.save(newAdmin);
      this.logger.log(`Admin user created: ${adminEmail}`);
    }

    let testUser = await userRepo.findOne({ where: { email: testEmail } });
    if (!testUser) {
      const user = new UserOrmEntity();
      user.email = testEmail;
      user.displayName = testDisplayName;
      user.passwordHash = await this.passwordHashing.hash(testPassword);
      user.isActive = true;
      user.requirePasswordChange = true;
      user.emailVerifiedAt = new Date();
      testUser = await userRepo.save(user);
      this.logger.log(`Test user created: ${testEmail}`);
    }

    const platformRoles = [
      { name: 'PLATFORM_ADMIN', description: 'Administrador de plataforma' },
      { name: 'AUDITOR', description: 'Auditor de plataforma' },
      { name: 'USER', description: 'Usuario de plataforma' },
    ];

    for (const role of platformRoles) {
      const exists = await platformRoleRepo.findOne({
        where: { name: role.name },
      });
      if (exists) {
        continue;
      }
      const platformRole = new PlatformRoleOrmEntity();
      platformRole.name = role.name;
      platformRole.description = role.description;
      await platformRoleRepo.save(platformRole);
    }

    const platformPermissions = [
      // Visibility
      'platform:projects:*:list',
      'platform:projects:*:read',
      'platform:tools:*:list',
      // Requests (project scope)
      'project:requests:*:list',
      'project:requests:*:create',
      'project:requests:*:read',
      'project:requests:*:comment',
    ];

    const permissionMap = new Map<string, PlatformPermissionOrmEntity>();
    for (const action of platformPermissions) {
      let permission = await platformPermissionRepo.findOne({
        where: { action },
      });
      if (!permission) {
        permission = new PlatformPermissionOrmEntity();
        permission.action = action;
        permission = await platformPermissionRepo.save(permission);
      }
      permissionMap.set(action, permission);
    }

    const roleMap = new Map<string, PlatformRoleOrmEntity>();
    for (const roleName of ['PLATFORM_ADMIN', 'AUDITOR', 'USER']) {
      const role = await platformRoleRepo.findOne({
        where: { name: roleName },
      });
      if (role) {
        roleMap.set(roleName, role);
      }
    }

    const assignPermissions = async (roleName: string, actions: string[]) => {
      const role = roleMap.get(roleName);
      if (!role) {
        return;
      }
      for (const action of actions) {
        const permission = permissionMap.get(action);
        if (!permission) {
          continue;
        }
        const existing = await platformRolePermissionRepo.findOne({
          where: {
            platformRoleId: role.platformRoleId,
            platformPermissionId: permission.platformPermissionId,
          },
        });
        if (existing) {
          continue;
        }
        const rolePermission = new PlatformRolePermissionOrmEntity();
        rolePermission.platformRoleId = role.platformRoleId;
        rolePermission.platformPermissionId = permission.platformPermissionId;
        await platformRolePermissionRepo.save(rolePermission);
      }
    };

    await assignPermissions('PLATFORM_ADMIN', platformPermissions);
    await assignPermissions('AUDITOR', [
      'platform:projects:*:list',
      'platform:projects:*:read',
      'platform:tools:*:list',
    ]);
    await assignPermissions('USER', [
      'platform:projects:*:list',
      'platform:projects:*:read',
      'platform:tools:*:list',
      'project:requests:*:list',
      'project:requests:*:create',
      'project:requests:*:read',
      'project:requests:*:comment',
    ]);

    if (admin) {
      const adminRole = roleMap.get('PLATFORM_ADMIN');
      if (adminRole) {
        const exists = await userPlatformRoleRepo.findOne({
          where: {
            userId: admin.userId,
            platformRoleId: adminRole.platformRoleId,
          },
        });
        if (!exists) {
          const assignment = new UserPlatformRoleOrmEntity();
          assignment.userId = admin.userId;
          assignment.platformRoleId = adminRole.platformRoleId;
          assignment.validFrom = new Date();
          assignment.validUntil = null;
          await userPlatformRoleRepo.save(assignment);
        }
      }
    }

    if (testUser) {
      const userRole = roleMap.get('USER');
      if (userRole) {
        const exists = await userPlatformRoleRepo.findOne({
          where: {
            userId: testUser.userId,
            platformRoleId: userRole.platformRoleId,
          },
        });
        if (!exists) {
          const assignment = new UserPlatformRoleOrmEntity();
          assignment.userId = testUser.userId;
          assignment.platformRoleId = userRole.platformRoleId;
          assignment.validFrom = new Date();
          assignment.validUntil = null;
          await userPlatformRoleRepo.save(assignment);
        }
      }
    }
  }

  private async seedProjectDefaults(): Promise<void> {
    const projectRepo = this.dataSource.getRepository(ProjectOrmEntity);
    const environmentRepo = this.dataSource.getRepository(
      ProjectEnvironmentOrmEntity,
    );
    const moduleRepo = this.dataSource.getRepository(ProjectModuleOrmEntity);
    const roleRepo = this.dataSource.getRepository(ProjectRoleOrmEntity);

    const projectCode = 'Aprendeba';
    const projectName = 'Aprendeba';
    const projectDescription = 'Aprendeba';

    let project = await projectRepo.findOne({ where: { code: projectCode } });
    if (!project) {
      project = new ProjectOrmEntity();
      project.code = projectCode;
      project.name = projectName;
      project.description = projectDescription;
      await projectRepo.save(project);
      this.logger.log(`Default project created: ${projectCode}`);
    }

    const environments: SeedEnvironment[] = [
      { code: 'develop', name: 'Development', priority: 10 },
      { code: 'demo', name: 'Demo', priority: 20 },
      { code: 'staging', name: 'Staging', priority: 30 },
      { code: 'prod', name: 'Production', priority: 40 },
    ];

    for (const environment of environments) {
      const exists = await environmentRepo.findOne({
        where: { projectId: project.projectId, code: environment.code },
      });
      if (exists) {
        continue;
      }
      const env = new ProjectEnvironmentOrmEntity();
      env.projectId = project.projectId;
      env.code = environment.code;
      env.name = environment.name;
      env.description = null;
      env.priority = environment.priority;
      await environmentRepo.save(env);
    }

    const modules = [
      { code: 'legajo', name: 'Legajo' },
      { code: 'notificaciones', name: 'Notificaciones' },
    ];

    for (const module of modules) {
      const exists = await moduleRepo.findOne({
        where: { projectId: project.projectId, code: module.code },
      });
      if (exists) {
        continue;
      }
      const mod = new ProjectModuleOrmEntity();
      mod.projectId = project.projectId;
      mod.code = module.code;
      mod.name = module.name;
      mod.description = null;
      await moduleRepo.save(mod);
    }

    const roles = [
      { name: 'DEVELOPER', description: 'Desarrollador' },
      { name: 'LEADER', description: 'Lider' },
      { name: 'ARCHITECT', description: 'Arquitecto' },
      { name: 'TESTER', description: 'QA' },
    ];

    for (const role of roles) {
      const exists = await roleRepo.findOne({
        where: { projectId: project.projectId, name: role.name },
      });
      if (exists) {
        continue;
      }
      const projectRole = new ProjectRoleOrmEntity();
      projectRole.projectId = project.projectId;
      projectRole.name = role.name;
      projectRole.description = role.description;
      await roleRepo.save(projectRole);
    }
  }
}
