import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length > 8) {
      throw new BadRequestException('비밀번호는 8자로 ');
    }
    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`최대 길이는 ${this.length}`);
    }
    return value.toString();
  }
}
@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.toString().length < this.length) {
      throw new BadRequestException(`최소 길이는 ${this.length}`);
    }
    return value.toString();
  }
}
