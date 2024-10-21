import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';
import User from './user.model'; // Ensure the import path is correct

class Payment extends Model {
  public payId!: number;
  public userId!: number;
  public userName!: string;
  public earnWallet!: number;
  public depositWallet!: number;
  public referralEarning!: number;
  public selfInvestment!: number;
  public levelEarning!: number; // Corrected from 'lavalEarning'
  public aiEarning!: number;
  public royalty!: number;
  public totalWithdraw!: number;
  public dailyLevelEarning!: number;
  public leadershipEarning!: number;
  public oneTimeEarning!: number;
  public starEarning!: number;
  public totalAmount!: number;
  public plan!: string;
  public commission!: string;
  public planStartDate!: string;
  public planEndDate!: string;
  public status!: string;
  public filename?: string;
  public filepath?: string;
  public mimetype?: string;
}

Payment.init({
  payId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users', // This should refer to the correct table name in your DB
      key: 'userId',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  earnWallet: {
    type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for better precision with money
    allowNull: true,
    defaultValue: 0,
  },
  depositWallet: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  referralEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  selfInvestment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  levelEarning: { // Corrected name from lavalEarning to levelEarning
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  aiEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  royalty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  totalWithdraw: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  dailyLevelEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  leadershipEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  oneTimeEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  starEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  commission: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  planStartDate:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now
  },
  planEndDate:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Date.now
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments',
  timestamps: true,
});

export default Payment;
