import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError, QueryFailedError, TypeORMError } from "typeorm";


@Catch(TypeORMError)
export class TypeORMErrorExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Произошла ошибка на сервере';

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Ресурс не найден';
    } else if (exception instanceof QueryFailedError) {
      switch (exception.driverError.code) {
        case ('23505'):
          if (request.url === '/users/me/' || request.url === '/signup/') {
            status = HttpStatus.CONFLICT;
            message = 'Пользователь с таким юзернеймом или почтой уже существует';
          }
          break;
      }
    }

    response
      .status(status)
      .json({
        statusCode: status,
        message
      });
  }
}