import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // No specific roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false; // User is not authenticated
    }

    return requiredRoles.includes(user.role); // Check if the user has the required role
  }
}
