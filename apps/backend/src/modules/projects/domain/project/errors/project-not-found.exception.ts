import { ProjectException } from './project.exception';

export class ProjectNotFoundException extends ProjectException {
  constructor(message = 'Project not found') {
    super(message);
    this.name = 'ProjectNotFoundException';
  }
}
