import { Project } from '../entity/project.entity';
import { ProjectId } from '../value-objects/project-id.vo';
import { ProjectCode } from '../value-objects/project-code.vo';

export interface ProjectRepositoryPort {
  save(project: Project): Promise<void>;
  findById(projectId: ProjectId): Promise<Project | null>;
  findByCode(code: ProjectCode): Promise<Project | null>;
  existsByCode(code: ProjectCode): Promise<boolean>;
}
