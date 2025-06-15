import { readFileSync } from 'fs';
import { join } from 'path';

interface Student {
  studentId: string;
  name: string;
  age: number;
  aptitudeScore: number;
  battleExperience: string;
  specialization: string;
}

export class StudentService {
  private readonly students: Student[];

  constructor() {
    const studentsPath = join(__dirname, 'students.json');
    const studentsJson = readFileSync(studentsPath, 'utf-8');

    this.students = JSON.parse(studentsJson).students;
  }

  public getStudentInfo(name: string): Student | null {
    const student = this.students.find((student) => student.name.toLowerCase() === name.toLowerCase());

    return student || null;
  }
}
