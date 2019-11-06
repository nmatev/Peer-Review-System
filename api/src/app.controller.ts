import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  async publicPartPosts() {
    return {
      message: `This is the public part, you can only read the posts!`,
    };
  }
}
