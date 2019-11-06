import { createParamDecorator, Inject } from '@nestjs/common';

export const Token = createParamDecorator(async (data, req) => {
    const token = req.headers.authorization;
    return token;
});
