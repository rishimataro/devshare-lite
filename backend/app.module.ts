import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://ngocthaodana:Benyxinh123@@cluster0devshare-lite.zqsquks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0devshare-lite'),
  ],
})
export class AppModule {}
// mongodb+srv://ngocthaodana:Benyxinh123@@cluster0.r9uguhn.mongodb.net/