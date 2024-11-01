import Payment from '../models/user/payment.model';
import User from '../models/user/user.model';
import { hashPassword } from '../utils/authUtils';
import PaymentService from '../services/payment.service';

interface UserRegistrationData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string;
}

export default class UserService {
  // Fetch all users with specific fields
  static async getAllUsers() {
    return await User.findAll({
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename'],
    });
  }

  static async getUserById(userId: any) {
    return await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'mobile', 'emailVerified', 'referralCode', 'createdAt', 'status', 'filepath', 'filename'],
    });
  }





  static async updateUserStatus(userId: any, status: any) {
    const user: any = await User.findByPk(userId);
    const referral = await Payment.findOne({ where: { userId: user.parentUserId } });
    const referee = await Payment.findOne({ where: { userId } });


    if (!user) {
      throw new Error('User not found');
    }

    if (referral) {
      referral.totalAmount += 100;
      await referral.save();
    }

    if (referee) {
      referee.status = 'live'
      await referee.save();
    }

    user.status = status;
    await user.save();
    return user;
  }

  static async updateUser(userId: any, data: any) {   
    return User.update(data, { where: { userId: userId } });
  }
  
  // Create a user with optional referral handling
  static async createUser(data: UserRegistrationData) {
    return await this.registerUserWithReferral(data);
  }

  private static generateReferralCode(): string {
    const prefix = "REF";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter1 = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomLetter2 = letters.charAt(Math.floor(Math.random() * letters.length));

    return `${prefix}${randomNum}${randomLetter1}${randomLetter2}`;
  }

  private static async generateUniqueReferralCode(): Promise<string> {
    let referralCode!: string;
    let isUnique = false;

    while (!isUnique) {
      referralCode = this.generateReferralCode();
      const existingUser = await User.findOne({ where: { referralCode } });
      isUnique = !existingUser;
    }

    return referralCode;
  }

  private static async registerUserWithReferral(data: UserRegistrationData) {
    const { name, email, mobile, password, referralCode } = data;
    const hashedPassword = await hashPassword(password);
    let parentUserId: string | null = null; // Use string since userId is a string

    if (referralCode) {
      const referrer: any = await User.findOne({ where: { referralCode } });
      if (referrer) {
        parentUserId = referrer.userId; // Assuming userId is a string
      }
    }

    // Generate the userId here
    const lastUser = await User.findOne({
      order: [['userId', 'DESC']],
    });

    let newIdNumber = 1; // Default to 1 if no users exist
    if (lastUser && lastUser.userId) {
      // Extract numeric part from the last user’s ID (e.g., "AI0001" -> 1)
      const lastIdNumber = parseInt(lastUser.userId.slice(2), 10);
      newIdNumber = lastIdNumber + 1;
    }

    // Format the new `userId` with "AI" prefix and 4-digit zero padding
    const userId = `AI${newIdNumber.toString().padStart(4, '0')}`;
    console.log(`Generated userId for new user: ${userId}`);

    const newUser = await User.create({
      userId, // Assign the generated userId here
      name,
      email,
      mobile,
      password: hashedPassword,
      parentUserId,
      referralCode: await this.generateUniqueReferralCode(),
    });

    return newUser;
  }

  static async getReferralChain(userId: any): Promise<{ user: User; referrals: User[] }[]> {
    const referralChain: { user: User; referrals: User[] }[] = [];
    let currentUser: any = await User.findByPk(userId);

    while (currentUser) {
      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId }
      });

      referralChain.push({ user: currentUser, referrals });

      currentUser = referrals.length > 0 ? referrals[0] : null;
    }

    return referralChain;
  }


  static async getUserReferralChainList(userId: any): Promise<{ user: User | null; referrals: User[] }> {
    async function fetchChain(currentUser: User | null): Promise<{ user: User; referrals: User[] }> {
      if (!currentUser) {
        // Return a valid structure even when the user is null
        return { user: {} as User, referrals: [] }; // Return an empty User object as a placeholder
      }

      const referrals: User[] = await User.findAll({
        where: { parentUserId: currentUser.userId }
      });

      // Fetch referral chains for each referral and flatten the results
      const referralChains = await Promise.all(referrals.map(fetchChain));

      // Flatten the referral chains into a single array
      const allReferrals: User[] = referralChains.reduce((acc, chain) => {
        acc.push(chain.user); // Add the current user to the flat array
        return acc.concat(chain.referrals); // Concatenate the nested referrals
      }, [] as User[]);

      return { user: currentUser, referrals: allReferrals };
    }

    const initialUser: User | null = await User.findByPk(userId);
    return await fetchChain(initialUser);
  }

  static async getUserParentChain(userId: any): Promise<User[]> {
    const parents: User[] = [];
  
    let currentUser = await User.findByPk(userId);
    while (currentUser && currentUser.parentUserId) {
      parents.push(currentUser);
      currentUser = await User.findByPk(currentUser.parentUserId);
    }
  
    // Push the root user (who has no parent) if they exist
    if (currentUser) {
      parents.push(currentUser);
    }
  
    return parents;
  }


  // static async getUserReferralChainList(userId: any): Promise<{ user: User; referrals: any[] }> {
  //   async function fetchChain(currentUser: User): Promise<{ user: User; referrals: any[] }> {
  //     if (!currentUser) null;

  //     const referrals = await User.findAll({
  //       where: { parentUserId: currentUser.userId }
  //     });

  //     const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

  //     return { user: currentUser, referrals: referralChain };
  //   }

  //   const initialUser: any = await User.findByPk(userId);
  //   return await fetchChain(initialUser);
  // }

  static async getReferralChildrenTaskCompleted(userId: any): Promise<{
    user: User | null;
    referrals: any[],
    liveReferralCount: number // Total live referral count
  }> {

    // Helper function to recursively fetch the referral chain and count 'live' status referrals
    async function fetchChain(
      currentUser: User | null
    ): Promise<{
      user: User | null;
      referrals: any[],
      liveReferralCount: number // Track the count of 'live' referrals at this level
    }> {
      if (!currentUser) {
        return { user: null, referrals: [], liveReferralCount: 0 };
      }

      // Fetch immediate referrals for the current user
      const referrals = await User.findAll({
        where: { parentUserId: currentUser.userId }
      });

      // Recursively fetch each referral's chain
      const referralChain = await Promise.all(referrals.map(async (referral) => await fetchChain(referral)));

      // Count only referrals with 'live' status at the current level
      const liveCountAtCurrentLevel = referrals.filter(referral => referral.status === 'live').length;

      // Sum up 'live' referral counts from all nested chains
      const liveReferralCount = liveCountAtCurrentLevel + referralChain.reduce((acc, referral) => acc + referral.liveReferralCount, 0);

      return {
        user: currentUser,
        referrals: referralChain,
        liveReferralCount // Return the count of 'live' status referrals
      };
    }

    // Fetch the initial user to start the chain
    const initialUser: User | null = await User.findByPk(userId);

    if (!initialUser) throw new Error('User not found');

    // Call the recursive function to fetch chain and count 'live' status referrals
    return await fetchChain(initialUser);

  }

  static async deleteUser(id: any) {
    const coin = await User.findByPk(id);
    if (coin) {
      await coin.destroy();
      return { message: 'User deleted successfully' };
    }
    throw new Error('User not found');
  }

}


