import { readFileSync } from 'fs';
import { join } from 'path';

interface Soldier {
  studentId: string;
  name: string;
  rank: string;
  battlesWon: number;
}

interface ArmyRecord {
  wins: number;
  losses: number;
}

interface Army {
  armyName: string;
  commanderId: string;
  commanderName: string;
  soldiers: Soldier[];
  armyRecord: ArmyRecord;
  knownTactics?: string[];
}

export class ArmyService {
  private readonly armies: Army[];

  constructor() {
    const armiesPath = join(__dirname, 'armies.json');
    const armiesJson = readFileSync(armiesPath, 'utf-8');

    this.armies = JSON.parse(armiesJson).armies;
  }

  public getMyArmy(studentId: string): Army | null {
    const army = this.armies.find((army) =>
      army.commanderId === studentId ||
      army.soldiers.some((soldier) => soldier.studentId === studentId)
    );

    return army || null;
  }

  public getOpponentArmy(name: string): Army | null {
    const army = this.armies.find((army) => army.armyName.toLowerCase() === name.toLowerCase());

    return army || null;
  }
}
