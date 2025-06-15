import { StudentService } from './StudentService';

interface Options {
  studentService: StudentService;
}

export class TokenService {
  private readonly studentService: StudentService;

  constructor({ studentService }: Options) {
    this.studentService = studentService;
  }

  public validateToken(token: string): string | null {
    const studentId = Buffer.from(token, 'base64').toString('utf-8');

    const student = this.studentService.getStudent(studentId);

    if (!student) {
      return null;
    }

    return student.studentId;
  }
}
