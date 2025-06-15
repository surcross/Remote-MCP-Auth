import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { ArmyService } from '../services/ArmyService';
import { StudentService } from '../services/StudentService';

export const server = new McpServer({
  name: 'example-server',
  version: '1.0.0'
});

const armyService = new ArmyService();
const studentService = new StudentService();

server.tool(
  'get-my-army',
  'Get information about your army including soldiers and battle record',
  {
    studentId: z.string().describe('Name of the student'),
  },
  ({ studentId }) => {
    const myArmy = armyService.getMyArmy(studentId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(myArmy),
        },
      ],
    }
  }
);

server.tool(
  'get-opponent-army',
  'Get information about an opponent army',
  {
    armyName: z.string().describe('Name of the opponent army to research'),
  },
  ({ armyName }) => {
    const opponentArmy = armyService.getOpponentArmy(armyName);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(opponentArmy),
        },
      ],
    }
  }
);

server.tool(
  'get-student-info',
  'Get detailed information about a student',
  {
    studentName: z.string().describe('Name of the student to look up'),
  },
  ({ studentName }) => {
    const studentInfo = studentService.getStudentInfo(studentName);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(studentInfo),
        },
      ],
    }
  }
);
