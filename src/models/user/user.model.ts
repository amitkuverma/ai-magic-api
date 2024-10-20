import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class User extends Model {
  public userId!: number;
  public name!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public position!: string;
  public totalDirect!: number;
  public activeDirect!: number;
  public totalTeam!: number;
  public activeTeam!: number;
  public filename?: string;
  public filepath?: string;
  public mimetype?: string;
  public referralCode?: string;
  public parentUserId?: number | null;
  public otp?: string;
  public emailVerified!: boolean;
  public status!: string;
  public isAdmin!: boolean;
}

User.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Emails are typically unique
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures mobile numbers are unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalDirect: {
    type: DataTypes.INTEGER, // Changed from DataTypes.NUMBER
    allowNull: true,
    defaultValue: 0,
  },
  activeDirect: {
    type: DataTypes.INTEGER, // Changed from DataTypes.NUMBER
    allowNull: true,
    defaultValue: 0,
  },
  totalTeam: {
    type: DataTypes.INTEGER, // Changed from DataTypes.NUMBER
    allowNull: true,
    defaultValue: 0,
  },
  activeTeam: {
    type: DataTypes.INTEGER, // Changed from DataTypes.NUMBER
    allowNull: true,
    defaultValue: 0,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Typically email is unverified by default
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentUserId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'users',
      key: 'userId',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, // Ensures referral codes are unique
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'pending', // Corrected typo
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

export default User;
