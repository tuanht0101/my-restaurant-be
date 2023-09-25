import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) {
      return true; // No roles are defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you store user information in the request object

    // Check if the user has the required role
    if (user && roles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
