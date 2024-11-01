import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth';

const chainRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Chain
 *   description: Chain management API
 */

/**
 * @swagger
 * /api/referral-chain/{userId}:
 *   get:
 *     summary: Get the referral chain for a user
 *     description: Retrieve the entire referral chain for a specific user, showing the hierarchy of who referred whom.
 *     tags: [Chain]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get the referral chain for
 *     responses:
 *       200:
 *         description: The referral chain for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referral chain found for the user
 *       500:
 *         description: Server error
 */

// API to get the referral chain for a user
chainRouter.get('/referral-chain/:userId', authenticateToken, UserController.getReferralChain);

/**
 * @swagger
 * /api/referrals/{userId}:
 *   get:
 *     summary: Get the referral chain for a user
 *     description: Retrieve the entire referral chain for a specific user, showing the hierarchy of who referred whom.
 *     tags: [Chain]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get the referral chain for
 *     responses:
 *       200:
 *         description: The referral chain for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referral chain found for the user
 *       500:
 *         description: Server error
 */

// API to get the referral chain for a user
chainRouter.get('/referrals/:userId', authenticateToken, UserController.getUserReferralChainList);

/**
 * @swagger
 * /api/referral-parent/{userId}:
 *   get:
 *     summary: Get the referrals made by a user
 *     description: Retrieve all the users that were referred by a specific user.
 *     tags: [Chain]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get referrals made by them
 *     responses:
 *       200:
 *         description: List of users referred by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referrals found for the user
 *       500:
 *         description: Server error
 */

// API to get all the referrals made by a user
chainRouter.get('/referral-parent/:userId', authenticateToken, UserController.getReferralParent);

/**
 * @swagger
 * /api/referral-children/{userId}:
 *   get:
 *     summary: Get the referrals made by a user
 *     description: Retrieve all the users that were referred by a specific user.
 *     tags: [Chain]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to get referrals made by them
 *     responses:
 *       200:
 *         description: List of users referred by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *                   parentUserId:
 *                     type: integer
 *                     description: The ID of the user who referred this user
 *       404:
 *         description: No referrals found for the user
 *       500:
 *         description: Server error
 */

// API to get all the referrals made by a user
chainRouter.get('/referral-children/:userId', authenticateToken, UserController.getReferralChildren);

export default chainRouter;