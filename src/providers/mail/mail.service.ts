import Invitations from '@/modules/company/invitation.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable() 
class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string, url: string) {

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: name,
        url,
      },
    });
  }

  public sendEmployeeInvitation = async (email: string, url: string, name: string) => {
    await this.mailerService.sendMail({
      to: email,
      subject: "Invitation!!",
      template: './invitation',
      context: {
        url, name
      }
    })
  }
}

export default MailService;
