// src/groups/groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // רשימת כל הקבוצות הפעילות
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.groupsService.getAllGroups();
  }

  // הקבוצות שאני חבר בהן
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyGroups(@Req() req: any) {
    const userId = req.user?.userId;
    return this.groupsService.getUserGroups(userId);
  }

  // הצטרפות לקבוצה (היום – כאילו שילם 1 ש"ח)
  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async joinGroup(@Param('id') groupId: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.groupsService.joinGroupWithPayment(userId, groupId);
  }

  // יציאה מקבוצה – זה מה שהכפתור "עזיבה" קורא אליו (DELETE /api/groups/:id/join)
  @Delete(':id/join')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async leaveGroup(@Param('id') groupId: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.groupsService.leaveGroup(userId, groupId);
  }

  // מציאת קבוצה פעילה לפי מוצר (למסך מוצר)
  @Get('by-product/:productId')
  @HttpCode(HttpStatus.OK)
  async getActiveGroupByProduct(@Param('productId') productId: string) {
    return this.groupsService.getActiveGroupByProduct(productId);
  }

  // פינג קטן לדיבוג
  @Get('ping')
  @HttpCode(HttpStatus.OK)
  ping() {
    return { ok: true };
  }
  // הוסף את זה בתוך ה-Class GroupsController
@Get(':id')
@HttpCode(HttpStatus.OK)
async getOne(@Param('id') id: string) {
  return this.groupsService.getGroupById(id); 
  // וודא שב-GroupsService קיימת פונקציה בשם getGroupById
}
}
