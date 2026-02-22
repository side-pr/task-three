import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from 'src/service/dashboard.service';
import { ServiceApiResponse } from 'src/config/api-response';
import { DashboardResponse } from 'src/dto/dashboard-response.dto';

@Controller('api/dashboard')
@ApiTags('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: '대시보드 통계 조회 (전체 유저)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '대시보드 통계 조회 성공',
    type: DashboardResponse,
  })
  async getDashboard(): Promise<ServiceApiResponse<DashboardResponse>> {
    const dashboardResponse = await this.dashboardService.getDashboard();
    return ServiceApiResponse.success(HttpStatus.OK, dashboardResponse);
  }
}
