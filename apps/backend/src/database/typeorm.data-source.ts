import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TypeormPermissionEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-permission.entity';
import { TypeormRoleEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-role.entity';
import { TypeormUserEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-user.entity';
import { TypeormRolePermissionEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-role-permission.entity';
import { TypeormUserPermissionEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-user-permission.entity';
import { TypeormUserRoleEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-user-role.entity';
import { TypeormProjectToolEntity } from '../modules/identity/infrastructure/persistence/typeorm/entities/typeorm-project-tool.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'magic_tool',
  entities: [
    TypeormUserEntity,
    TypeormRoleEntity,
    TypeormPermissionEntity,
    TypeormUserRoleEntity,
    TypeormUserPermissionEntity,
    TypeormRolePermissionEntity,
    TypeormProjectToolEntity,
  ],
  migrations: ['apps/backend/src/main/database/migrations/*.ts'],
  synchronize: false,
});
