import { DataSource } from 'typeorm';
import { CurrentUserReadPort } from '@identity/application/shared/port/current-user-read.port';

export class TypeOrmCurrentUserReadAdapter implements CurrentUserReadPort {
  constructor(private readonly dataSource: DataSource) {}

  async getRoles(userId: string, pagination: { page: number; pageSize: number }) {
    const { limit, offset } = this.toPagination(pagination);
    const items = await this.dataSource.query(
      `
      SELECT
        upr.user_project_role_id AS "userProjectRoleId",
        upr.project_id AS "projectId",
        p.code AS "projectCode",
        p.name AS "projectName",
        upr.project_role_id AS "projectRoleId",
        pr.name AS "projectRoleName",
        upr.valid_from AS "validFrom",
        upr.valid_until AS "validUntil"
      FROM projects.user_project_role upr
      JOIN projects.project_role pr
        ON pr.project_role_id = upr.project_role_id
      JOIN projects.project p
        ON p.project_id = upr.project_id
      WHERE upr.user_id = $1
      ORDER BY upr.valid_from DESC, upr.user_project_role_id DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset],
    );

    const total = await this.count(
      `
      SELECT COUNT(*)::int AS total
      FROM projects.user_project_role upr
      WHERE upr.user_id = $1
    `,
      [userId],
    );

    return { items, total };
  }

  async getPermissions(
    userId: string,
    pagination: { page: number; pageSize: number },
  ) {
    const { limit, offset } = this.toPagination(pagination);
    const items = await this.dataSource.query(
      `
      SELECT
        pp.project_permission_id AS "projectPermissionId",
        pp.project_id AS "projectId",
        p.code AS "projectCode",
        p.name AS "projectName",
        pp.project_module_id AS "projectModuleId",
        pm.code AS "projectModuleCode",
        pm.name AS "projectModuleName",
        pp.project_environment_id AS "projectEnvironmentId",
        pe.code AS "projectEnvironmentCode",
        pe.name AS "projectEnvironmentName",
        pp.action AS "action",
        pr.project_role_id AS "projectRoleId",
        pr.name AS "projectRoleName"
      FROM projects.user_project_role upr
      JOIN projects.project_role pr
        ON pr.project_role_id = upr.project_role_id
      JOIN projects.project_role_permission prp
        ON prp.project_role_id = pr.project_role_id
      JOIN projects.project_permission pp
        ON pp.project_permission_id = prp.project_permission_id
      JOIN projects.project p
        ON p.project_id = pp.project_id
      LEFT JOIN projects.project_module pm
        ON pm.project_module_id = pp.project_module_id
      LEFT JOIN projects.project_environment pe
        ON pe.project_environment_id = pp.project_environment_id
      WHERE upr.user_id = $1
      ORDER BY p.name ASC, pr.name ASC, pp.action ASC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset],
    );

    const total = await this.count(
      `
      SELECT COUNT(*)::int AS total
      FROM projects.user_project_role upr
      JOIN projects.project_role pr
        ON pr.project_role_id = upr.project_role_id
      JOIN projects.project_role_permission prp
        ON prp.project_role_id = pr.project_role_id
      JOIN projects.project_permission pp
        ON pp.project_permission_id = prp.project_permission_id
      WHERE upr.user_id = $1
    `,
      [userId],
    );

    return { items, total };
  }

  async getTeams(userId: string, pagination: { page: number; pageSize: number }) {
    const { limit, offset } = this.toPagination(pagination);
    const items = await this.dataSource.query(
      `
      SELECT
        tm.team_member_id AS "teamMemberId",
        tm.team_id AS "teamId",
        t.name AS "teamName",
        tm.role AS "teamRole",
        tm.valid_from AS "validFrom",
        tm.valid_until AS "validUntil",
        p.project_id AS "projectId",
        p.code AS "projectCode",
        p.name AS "projectName",
        pm.project_module_id AS "projectModuleId",
        pm.code AS "projectModuleCode",
        pm.name AS "projectModuleName"
      FROM projects.team_member tm
      JOIN projects.team t
        ON t.team_id = tm.team_id
      JOIN projects.project p
        ON p.project_id = t.project_id
      LEFT JOIN projects.team_module tmod
        ON tmod.team_id = t.team_id
      LEFT JOIN projects.project_module pm
        ON pm.project_module_id = tmod.project_module_id
      WHERE tm.user_id = $1
      ORDER BY tm.valid_from DESC, tm.team_member_id DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset],
    );

    const total = await this.count(
      `
      SELECT COUNT(*)::int AS total
      FROM projects.team_member tm
      WHERE tm.user_id = $1
    `,
      [userId],
    );

    return { items, total };
  }

  private toPagination(pagination: { page: number; pageSize: number }) {
    const page = pagination.page;
    const pageSize = pagination.pageSize;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    return { limit, offset };
  }

  private async count(sql: string, params: Array<string | number>) {
    const result = await this.dataSource.query(sql, params);
    return result[0]?.total ?? 0;
  }
}
