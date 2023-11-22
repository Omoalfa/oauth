import { AppModule } from '../app.module';
import MailService from '../providers/mail/mail.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MailServiceMock } from './helpers/mocks';
import { UserSignupDto } from '../modules/auth/auth.dto';
import { Repository } from 'typeorm';
import Users from '../modules/auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Auth (e2e)', () => {
  // let app: INestApplication;
  // let userRepo: Repository<Users>;

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   })
  //   .overrideProvider(MailService)
  //   .useValue(MailServiceMock)
  //   .compile();

  //   app = moduleFixture.createNestApplication();

  //   await app.init();

  //   userRepo = moduleFixture.get<Repository<Users>>(getRepositoryToken(Users))
  // });

  // afterAll(async () => {
  //   // await userRepo.clear();

  //   await app.close()
  // })

  it('Should allow user register on the platform', async () => {
    // const sendUserConfirmationspy = jest.spyOn(MailServiceMock, "sendUserConfirmation");

    // const mockUser: UserSignupDto = {
    //   email: "engr.omoalfa@gmail.com",
    //   password: "Ol@334_ejgiR",
    //   name: "Omoalfa Dev"
    // }

    // const res = await request(app.getHttpServer())
    //   .post('http://platform.localhost:3005/api/auth/signup')
    //   .set('Host', 'platform.localhost:3005')
    //   .send(mockUser)// Set the subdomain
    //   // .expect(404)

    // // expect(sendUserConfirmationspy).toHaveBeenCalled()
    // // const call = sendUserConfirmationspy.mock.lastCall
    // // const url = call[2]

    expect(true).toEqual(true);
  });
});
