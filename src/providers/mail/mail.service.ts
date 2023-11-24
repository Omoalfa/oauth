import ConfigVars from '@/config/interface';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable() 
class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly config: ConfigService<ConfigVars>
    ) {}

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

  public sendEmployeeInvitation = async (email: string, token: string, name: string, resetPassword: boolean) => {
    const url = this.config.get("frontend").base_url + resetPassword ? `/reset_password?token=${token}&requirePassword=true` : `/login`;

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
