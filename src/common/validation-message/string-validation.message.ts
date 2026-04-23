import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (args: ValidationArguments) => {
  return `${args.property}은(는) string 타입을 입력해야합니다.`;
};
