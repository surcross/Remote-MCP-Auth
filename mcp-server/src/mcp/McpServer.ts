import { McpServer as McpServerSdk } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Transport } from '@modelcontextprotocol/sdk/shared/transport';
import { z } from 'zod';

import { ArmyService } from '../services/ArmyService';
import { StudentService } from '../services/StudentService';

interface Options {
  armyService: ArmyService;
  studentService: StudentService;
}

interface ToolResponse {
  // Required to avoid TS error on node_modules/@modelcontextprotocol/sdk/dist/esm/types.d.ts:18703:9
  [x: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export class McpServer {
  private readonly armyService: ArmyService;

  private readonly studentService: StudentService;

  private server: McpServerSdk | null = null;

  constructor({ armyService, studentService }: Options) {
    this.armyService = armyService;
    this.studentService = studentService;

    this.init();
  }

  public connect(transport: Transport) {
    if (!this.server) {
      throw new Error('MCP server not initialized');
    }

    return this.server.connect(transport);
  }

  private init() {
    this.server = new McpServerSdk({
      name: 'Battle-School-Computer',
      version: '1.0.0',
    });

    this.server.tool(
      'get-my-army',
      'Get information about your army including soldiers and battle record',
      ({ authInfo }) => {
        if (!authInfo) {
          return this.respondWithText('Unauthorized');
        }

        const myArmy = this.armyService.getMyArmy(authInfo.clientId);

        return this.respondWithJson(myArmy);
      }
    );

    this.server.tool(
      'get-opponent-army',
      'Get information about an opponent army',
      {
        armyName: z.string().describe('Name of the opponent army to research'),
      },
      ({ armyName }, { authInfo }) => {
        if (!authInfo) {
          return this.respondWithText('Unauthorized');
        }

        const opponentArmy = this.armyService.getOpponentArmy(armyName);

        return this.respondWithJson(opponentArmy);
      }
    );

    this.server.tool(
      'get-student-info',
      'Get detailed information about a student',
      {
        studentName: z.string().describe('Name of the student to look up'),
      },
      ({ studentName }, { authInfo }) => {
        if (!authInfo) {
          return this.respondWithText('Unauthorized');
        }

        const studentInfo = this.studentService.getStudentInfo(studentName);

        return this.respondWithJson(studentInfo);
      }
    );
  }

  private respondWithText(text: string): ToolResponse {
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  private respondWithJson(json: unknown): ToolResponse {
    return this.respondWithText(JSON.stringify(json));
  }
}
