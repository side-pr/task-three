import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// Swagger 문서화용 클래스 (순환 의존성 방지)
export class ServiceApiResponse<T> {
  @ApiProperty({
    description: '성공, 실패 여부 (success, error)',
    example: 'success',
  })
  status: HttpStatus;

  @ApiProperty({
    description: '응답 메시지',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '결과 데이터 (있으면 데이터 출력, 없으면 null)',
    example: null,
  })
  data: T | null;

  constructor(status: HttpStatus, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data ?? null;
  }

  static success<T>(status: HttpStatus, data?: T): ServiceApiResponse<T> {
    return new ServiceApiResponse(status, 'success', data);
  }

  // static error<T>( message: string): DoudouMondeApiResponse<T> {
  //   return new DoudouMondeApiResponse<T>('error', message);
  // }
}
