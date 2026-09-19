// Fallback ambient module declaration for @prisma/client if Prisma binaries are not pre-generated locally
declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    [key: string]: any;
  }
}
