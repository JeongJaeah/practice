import { Router } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { UserDTO } from '../../interfaces/page/UserDTO';
import tunnel from 'tunnel-ssh';
// import * as tunnel from 'tunnel-ssh';

const router = Router();



export default router;
