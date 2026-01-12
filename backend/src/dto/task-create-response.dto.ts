import { ApiProperty } from '@nestjs/swagger';

export class TaskCreateResponseData {
  @ApiProperty({ description: '생성된 할일 ID', example: 1 })
  taskId: number;
}

export class TaskCreateResponse {
  @ApiProperty({ description: 'HTTP 상태 코드', example: 201 })
  status: number;

  @ApiProperty({ description: '응답 메시지', example: 'success' })
  message: string;

  @ApiProperty({ type: TaskCreateResponseData, description: '응답 데이터' })
  data: TaskCreateResponseData;
}
