import { ProjectException } from './project.exception';

export class ProjectAlreadyExistsException extends ProjectException {
  constructor(message = 'Project already exists') {
    super(message);
    this.name = 'ProjectAlreadyExistsException';
  }
}
