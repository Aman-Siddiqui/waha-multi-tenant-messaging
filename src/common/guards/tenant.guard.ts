import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userTenant = request.user?.tenant_id;
    const paramTenant = request.params?.tenant_id || request.body?.tenant_id;

    if (paramTenant && userTenant && paramTenant !== userTenant) {
      throw new ForbiddenException('Access to other tenant data is not allowed');
    }

    return true;
  }
}
