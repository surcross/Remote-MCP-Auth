import { verify } from 'jsonwebtoken';

import { StudentService } from './StudentService';

interface Options {
  accessTokenSecret: string;
  studentService: StudentService;
}

export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly studentService: StudentService;

  constructor({ accessTokenSecret, studentService }: Options) {
    this.accessTokenSecret = accessTokenSecret;
    this.studentService = studentService;
  }

  public validateToken(token: string): string | null {
    let decoded;
    try {
      decoded = verify(token, this.accessTokenSecret);
    } catch {
      return null;
    }

    if (!decoded.sub) {
      return null;
    }

    const student = this.studentService.getStudent(decoded.sub as string);

    if (!student) {
      return null;
    }

    return student.studentId;
  }
}
