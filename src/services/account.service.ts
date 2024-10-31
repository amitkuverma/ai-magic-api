import { where } from 'sequelize';
import AccountDetails from '../models/user/account.model';

class AccountDetailsService {
  async createAccountDetails(data: any) {
    return AccountDetails.create(data);
  }

  async getAllAccountDetails() {
    return AccountDetails.findAll();
  }

  async getAccountDetailsById(id: any) {
    return AccountDetails.findOne({ where: { userId: id } });
  }

  async updateAccountDetails(id: any, data: any) {
    return AccountDetails.update(data, { where: { accId: id } });
  }

  async deleteAccountDetails(id: any) {
    return AccountDetails.destroy({ where: { accId: id } });
  }
}

export default new AccountDetailsService();
