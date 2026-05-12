# NestJS + TypeScript + Sequelize Development Skill

This skill encodes the architectural patterns, folder conventions, database practices,
and best practices for a professional NestJS + TypeScript + Sequelize backend application.
Follow every section carefully before generating any code.

---

## 1. Tech Stack

| Layer                | Technology                                      |
|----------------------|-------------------------------------------------|
| Framework            | NestJS (modular architecture)                   |
| Language             | TypeScript (strict mode)                        |
| ORM                  | Sequelize + sequelize-typescript                |
| Auth                 | JWT Guards (custom implementation)              |
| Validation           | class-validator + class-transformer (DTOs)      |
| DB Migrations        | Sequelize CLI migrations                        |

---

## 2. Project Structure

```
src/
├── main.ts                        # Bootstrap, global pipes, CORS
├── app.module.ts                  # Root module — imports all feature modules
├── constants/
│   └── model.constants.ts         # Sequelize model name strings (single source of truth)
├── utility/
│   └── response.util.ts           # Standardized API response builder
│   └── hash.util.ts               # Password hashing helpers
│   └── <other-shared-utils>.ts
├── guards/
│   └── jwt.guard.ts               # JWT verification + standardized error throwing
└── {module}/
    ├── {module}.module.ts
    ├── {module}.controller.ts
    ├── {module}.service.ts
    ├── dto/
    │   ├── create-{module}.dto.ts
    │   └── update-{module}.dto.ts
    └── models/
        └── {module}.model.ts      # Sequelize model + TypeScript interfaces
```

> **Before writing anything new**, check `src/utility/` and `src/constants/` for existing
> helpers. Reuse before creating duplicates.

---

## 3. Standardized API Response Format

**Every** controller endpoint must return this shape — no exceptions:

```ts
{
  success:   boolean,
  message:   string,
  data?:     object | array | null,
  timestamp: string   // ISO-8601, auto-generated
}
```

### Response Utility

Located at `src/common/dto/apiResponse.dto.ts`. Use the static helpers — never construct the response object inline.

```ts
// src/common/dto/apiResponse.dto.ts

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;

  constructor(init?: Partial<ApiResponse<T>>) {
    Object.assign(this, init);
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data?: T, message = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>({ success: true, message, data });
  }

  static error<T>(message: string): ApiResponse<T> {
    return new ApiResponse<T>({ success: false, message });
  }
}
```

### Usage in Controllers

```ts
import { ApiResponse } from '../../common/dto/apiResponse.dto';
import { MESSAGES } from '../../common/constants/messages.constants';

return ApiResponse.success(user, MESSAGES.USER_FETCHED_SUCCESS);
return ApiResponse.error(MESSAGES.USER_NOT_FOUND);
```

User-facing strings live in `src/common/constants/messages.constants.ts` (`MESSAGES`) — never hardcode message strings in controllers/services.

---

## 4. Module Anatomy

Every feature is a self-contained NestJS module. The four files are mandatory:

```
{module}.module.ts       — declares providers, imports, exports
{module}.controller.ts   — routing, request/response, delegates to service
{module}.service.ts      — all business logic and DB operations
dto/                     — request payload validation
models/                  — Sequelize model definition
```

### Module File

```ts
// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

---

## 5. Controllers

- Responsible **only** for routing and response shaping.
- No business logic or DB calls — delegate entirely to the service.
- Always return `ApiResponse` via the response utility.
- Apply the JWT guard at controller or route level as appropriate.

```ts
// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { successResponse } from '../utility/response.util';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    return successResponse('User fetched successfully', user);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return successResponse('User created successfully', user, true);
  }
}
```

---

## 6. Services

- Contain **all** business logic.
- Are the only layer that directly interacts with Sequelize models.
- Throw `HttpException` (or NestJS built-ins) for errors — never return raw error objects.
- Use Sequelize managed transactions for multi-step DB operations.

```ts
// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.sequelize.transaction(async (t) => {
      return this.userModel.create({ ...dto }, { transaction: t });
    });
  }
}
```

---

## 7. DTOs (Data Transfer Objects)

- Used for **all** incoming request payloads — never accept `any` or raw `body`.
- Decorated with `class-validator` decorators for validation.
- Transformed with `class-transformer` (enable globally in `main.ts`).

```ts
// src/user/dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
```

```ts
// src/user/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### Global Pipe Setup (`main.ts`)
```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

---

## 8. Sequelize Models

Each model file contains:
1. TypeScript **interfaces** for creation attributes and instance attributes.
2. The **Sequelize model class** decorated with `@Table`.
3. **Lifecycle hooks** for model-level logic (hashing, timestamps, etc.).

```ts
// src/user/models/user.model.ts
import {
  Table, Column, Model, DataType,
  BeforeCreate, BeforeUpdate, HasMany,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { MODEL_NAMES } from '../../constants/model.constants';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserAttributes extends UserCreationAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Model ───────────────────────────────────────────────────────────────────

@Table({ tableName: MODEL_NAMES.USER, timestamps: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {

  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: 'viewer' })
  role: string;

  // ─── Hooks ────────────────────────────────────────────────────────────────

  @BeforeCreate
  static async hashPasswordOnCreate(instance: User) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  @BeforeUpdate
  static async hashPasswordOnUpdate(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }
}
```

---

## 9. Constants — Model Names

All Sequelize table/model name strings live in one file. Never hardcode model names elsewhere.

```ts
// src/constants/model.constants.ts
export const MODEL_NAMES = {
  USER:         'users',
  SUBSCRIPTION: 'subscriptions',
  PLAN:         'plans',
  TENANT:       'tenants',
} as const;
```

Usage in models: `@Table({ tableName: MODEL_NAMES.USER })`

---

## 10. JWT Guard

A single, reusable guard handles all JWT verification. It throws standardized errors
so every protected route behaves consistently.

```ts
// src/guards/jwt.guard.ts
import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Missing authentication token');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
```

---

## 11. Transactions

Use managed transactions for **any** operation that touches more than one table,
or any create/update/delete that must be atomic.

```ts
// Managed transaction pattern (preferred)
async transferData(fromId: string, toId: string): Promise<void> {
  await this.sequelize.transaction(async (t) => {
    await this.sourceModel.update({ transferred: true }, { where: { id: fromId }, transaction: t });
    await this.targetModel.create({ sourceId: fromId, targetId: toId }, { transaction: t });
  });
}
```

> If the callback throws, Sequelize automatically rolls back. Never manually commit/rollback
> inside a managed transaction.

---

## 12. Utility Functions

Any logic used in more than one place is extracted to `src/utility/`. Keep utilities pure
(no NestJS injections, no DB access).

```ts
// src/utility/hash.util.ts
import * as bcrypt from 'bcrypt';

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, 10);

export const comparePassword = (plain: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(plain, hashed);
```

```ts
// src/utility/pagination.util.ts
export interface PaginationMeta {
  page: number;
  pageSize: number;
  offset: number;
}

export function getPagination(page = 1, pageSize = 10): PaginationMeta {
  return { page, pageSize, offset: (page - 1) * pageSize };
}
```

---

## 13. Third-Party Integrations — Wrapper Services

All third-party integrations (AI, payments, email, SMS) are wrapped in a **pure NestJS service**
that hides the vendor behind a generic interface. This allows swapping engines via config
without changing calling code.

### Pattern: Generic AI Service

```ts
// src/utility/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AiCompletionOptions {
  prompt: string;
  maxTokens?: number;
}

@Injectable()
export class AiService {
  private readonly engine: string;

  constructor(private readonly config: ConfigService) {
    this.engine = this.config.get<string>('AI_ENGINE', 'gemini'); // 'gemini' | 'openai'
  }

  async complete(options: AiCompletionOptions): Promise<string> {
    if (this.engine === 'openai') return this.callOpenAi(options);
    return this.callGemini(options);
  }

  private async callOpenAi(options: AiCompletionOptions): Promise<string> {
    // OpenAI SDK call
    throw new Error('OpenAI not yet implemented');
  }

  private async callGemini(options: AiCompletionOptions): Promise<string> {
    // Gemini SDK call
    throw new Error('Gemini not yet implemented');
  }
}
```

Calling code imports `AiService` and calls `complete()` — it never knows which engine runs underneath.

Apply the same wrapper pattern for payment gateways, email providers, and SMS services.

---

## 14. Migrations & Seeders

### Migrations
- Generated via Sequelize CLI: `npx sequelize-cli migration:generate --name create-users`
- Always use `queryInterface.createTable` / `addColumn` / `removeColumn` — never raw SQL for schema changes.
- Every `up` must have a matching `down`.

```js
// migrations/20240101000000-create-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id:         { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name:       { type: Sequelize.STRING, allowNull: false },
      email:      { type: Sequelize.STRING, allowNull: false, unique: true },
      password:   { type: Sequelize.STRING, allowNull: false },
      role:       { type: Sequelize.STRING, defaultValue: 'viewer' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
```

### Seeders vs Custom Scripts
- **Seeders**: Use only for static reference data that every environment needs (e.g., default roles, plan tiers).
- **Custom Scripts**: For frequent, targeted data modifications (e.g., backfilling tenant permissions, one-time data corrections). Prefer a `scripts/` directory at the project root.

```ts
// scripts/update-tenant-permissions.ts
import { sequelize } from '../src/database'; // your DB connection

async function run() {
  await sequelize.query(`UPDATE tenants SET permissions = '["read","write"]' WHERE plan = 'pro'`);
  console.log('Done');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
```

Run with: `ts-node scripts/update-tenant-permissions.ts`

---

## 15. Quick Decision Guide

| Situation | Where it goes |
|---|---|
| Incoming request validation | `dto/create-{module}.dto.ts` |
| Business logic / DB queries | `{module}.service.ts` |
| Route handling / response shaping | `{module}.controller.ts` |
| Sequelize model + interfaces | `{module}/models/{module}.model.ts` |
| Shared pure functions | `src/utility/` |
| Third-party vendor wrapper | `src/utility/{vendor}.service.ts` |
| Model name strings | `src/constants/model.constants.ts` |
| Auth enforcement | `src/guards/jwt.guard.ts` |
| Schema changes | Sequelize CLI migration |
| Targeted data fix | `scripts/` custom TS script |

---

## 16. Code Quality Checklist

Before submitting any code, verify:

- [ ] Every endpoint returns the standard `{ status, message, toast, data }` shape via utility
- [ ] No business logic in controllers — service layer only
- [ ] All request bodies use a typed DTO with `class-validator` decorators
- [ ] Model file has both `CreationAttributes` and `Attributes` interfaces
- [ ] Model name string comes from `MODEL_NAMES` constant, not a hardcoded string
- [ ] Password hashing (and similar concerns) handled in model hooks, not service
- [ ] Multi-table operations wrapped in a managed Sequelize transaction
- [ ] Any logic used 2+ times extracted to `src/utility/`
- [ ] Third-party integrations behind a wrapper service, not called directly from a service/controller
- [ ] No `any` types — all values explicitly typed
- [ ] Migrations have a working `down` method
