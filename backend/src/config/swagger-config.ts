import { DocumentBuilder } from "@nestjs/swagger";

export default () => new DocumentBuilder()
  .setTitle('Kupipodariday')
  .setDescription('The Kupipodariday API description')
  .setVersion('1.0')
  .build()