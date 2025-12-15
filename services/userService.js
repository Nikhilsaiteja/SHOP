const userModel = require('../models/user-model');
const ownerModel = require('../models/owner-model');

const bcrypt = require('bcrypt');
const generateToken = require('../config/jwt-config');

const dbgr = require('debug')('app:userService');

const cache = require('../utils/redisCache');

class UserService{

    async registerUser(name, email, password, role, additionalData = []){
        try {
            dbgr('Data received in registerUser service:', {name, email, password, role, additionalData});
            const userExists = await userModel.findOne({email}) || await ownerModel.findOne({email});
            if(userExists){
                dbgr('User already exists with email:', email);
                throw new Error('User already exists');
            }

            password = await bcrypt.hash(password, 10);
            dbgr('Hashed password:', password);

            if(role === 'owner'){
                const newOwner = await ownerModel.create({
                    name,
                    email,
                    password,
                    ...additionalData
                });
                dbgr('New owner created:', newOwner);

                const cacheKey = `user:${newOwner._id}`;
                await cache.set(cacheKey, JSON.stringify(newOwner));
                dbgr('New owner cached with key:', cacheKey);

                return {user: newOwner, token: generateToken({ id: newOwner._id })};
            }

            const newUser = await userModel.create({
                name,
                email,
                password,
                ...additionalData
            })
            dbgr('New user created:', newUser);

            const cacheKey = `user:${newUser._id}`;
            await cache.set(cacheKey, JSON.stringify(newUser));
            dbgr('New user cached with key:', cacheKey);

            return {user: newUser, token: generateToken({ id: newUser._id })};
        } catch (error) {
            dbgr('Error in registerUser:', error);
            throw error;
        }
    }

    async loginUser(email, password){
        try{
            dbgr('Data received in loginUser service:', {email, password});

            const user = await userModel.findOne({email}) || await ownerModel.findOne({email});
            if(!user){
                dbgr('No user found with email:', email);
                throw new Error('Invalid email or password');
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword){
                dbgr('Invalid password for email:', email);
                throw new Error('Invalid email or password');
            }

            const token = generateToken({ id: user._id });
            dbgr('Generated JWT token for user:', token);

            const cacheKey = `user:${user._id}`;
            await cache.set(cacheKey, JSON.stringify(user));
            dbgr('User cached with key:', cacheKey);

            return {user, token};
        }catch(error){
            dbgr('Error in loginUser:', error);
            throw error;
        }
    }

    async deleteUser(userId){
        try{
            dbgr('Data received in deleteUser service:', {userId});

            const user = await userModel.findByIdAndDelete(userId) || await ownerModel.findByIdAndDelete(userId);
            if(!user){
                dbgr('No user found with ID:', userId);
                throw new Error('User not found');
            }

            await cache.delPattern('user:*');

            dbgr('User deleted successfully:', user);
        }catch(error){
            dbgr('Error in deleteUser:', error);
            throw error;
        }
    }

}

module.exports = new UserService();