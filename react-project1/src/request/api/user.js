/*
 * @Description: 
 * @Author: Author
 * @Date: 2022-07-05 15:30:43
 * @LastEditTime: 2022-07-05 15:32:26
 * @LastEditors: Author
 */
import {
  post
} from './../request';

export const login = data => post('/api/user/login', data)