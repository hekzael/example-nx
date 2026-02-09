import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'role_permissions' })
export class TypeormRolePermissionEntity {
  @PrimaryColumn({ name: 'role_id', type: 'text' })
  roleId!: string;

  @PrimaryColumn({ name: 'permission_id', type: 'text' })
  permissionId!: string;
}
