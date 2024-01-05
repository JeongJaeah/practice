import { Router } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { UserDTO } from '../../interfaces/page/UserDTO';
import tunnel from 'tunnel-ssh';
// import * as tunnel from 'tunnel-ssh';

const router = Router();

const artMap_getArtMapList_Query = () => {
  return `
SELECT A_CATE
  , A_SEQ
  , A_LOC1
  , LPAD(ROW_NUMBER() OVER(ORDER BY M_ORDER),2,'0') AS M_ORDER
  , '${process.env.SUB_DOMAIN}mobilePub/static/images/app/art/'||M_ORDER||'_Artmap_MOB.jpg' AS IMG_PATH
  , DCT_TYPE
  , TAB_GB
  , A_ART_NAME
  , A_WRITER
FROM (
  SELECT A.A_CATE
      , AD.A_LOC1
      , A.A_SEQ
      , A.M_ORDER
      , A.TAB_GB
      , A.DCT_TYPE
      , AD.A_ART_NAME
      , AD.A_WRITER
  FROM TBL_ART A
  INNER JOIN TBL_ART_DETAIL AD ON A.A_SEQ = AD.A_SEQ AND AD.LANG_SET = NVL(:LANG, 'KO')
  WHERE 1=1
      AND A.A_USE_YN = 'Y'
      AND A.A_DEL_YN = 'N'
      AND A.TAB_GB IN ('ATC1', 'ATC2')
      AND A.M_ORDER IS NOT NULL
  UNION ALL
      SELECT 'SCULPT_INSTALL'
          ,'HOTEL PARADISE SPRING GARDEN'
          , 323
          , '11'
          , 'ATC1'
          , null
          , (SELECT AD.A_ART_NAME FROM TBL_ART A, TBL_ART_DETAIL AD, TBL_FILE F WHERE A.A_SEQ = AD.A_SEQ AND F.F_PK(+) = A.A_SEQ AND F.F_DIVISION(+) = 'ART_IMG' AND A.M_ORDER = 10 AND AD.LANG_SET = NVL(:LANG, 'KO') AND ROWNUM = 1)
          , (SELECT AD.A_WRITER FROM TBL_ART A, TBL_ART_DETAIL AD, TBL_FILE F WHERE A.A_SEQ = AD.A_SEQ AND F.F_PK(+) = A.A_SEQ AND F.F_DIVISION(+) = 'ART_IMG' AND A.M_ORDER = 10 AND AD.LANG_SET = NVL(:LANG, 'KO') AND ROWNUM = 1)
      FROM DUAL
  UNION ALL 
      SELECT 'A_ETC', NULL, NULL, '35', 'ATC2', null, 'ARTECTURE MEDIA FAÇADE', NULL FROM DUAL
  UNION ALL 
      SELECT 'A_ETC', NULL, NULL, '36', 'ATC2', null, 'CHROMATIC PARADISE', NULL FROM DUAL
  )
WHERE M_ORDER IS NOT NULL
  
  `;
};

router
  .route('/page/:id')
  .get((req, res) => {
    res.send('OK');
  })
  .post(
    async (req, res, next) => {
      let tempVO: any = {};
      tempVO.LANG = req.headers['accept-language'];
      tempVO.IP = req.get('X-FORWARDED-FOR');
      console.log('post');
      const pool = req.app.locals.pool;
      const conn = await pool.getConnection();

      const LANG = 'ko';
      // const row = await conn.execute(`
      // SELECT *
      // FROM TEST."USER"
      // `);
      const sshConfig = {
        host: '10.153.10.165',
        port: 22, //접속할 리눅스ssh포트
        username: 'pcityadm',
        password: 'paradise12!@#',
        dstHost: '172.18.240.71', //최종목적지(내가 접속 할 데이터베이스)
        dstPort: 3521, //최종목적지에서 사용할 포트(내가 접속 할 데이터베이스 포트)
      };

      const sshTunnel = await tunnel.createTunnel(
        { autoClose: false },
        {},
        sshConfig,
        { dstPort: 22000 }
      );
      console.log(sshTunnel)

      const row = await conn.execute(artMap_getArtMapList_Query, {
        LANG: LANG,
      });

      console.log(row.rows);

      if (Object.keys(req.query).length !== 0) {
        tempVO = req.query;
      }
      if (Object.keys(req.body).length !== 0) {
        tempVO = req.body;
      }
      if (Object.keys(req.params).length !== 0) {
        tempVO = req.params;
      }

      const dataVO = plainToInstance(UserDTO, req.body);

      const errors: ValidationError[] = await validate(dataVO, {
        skipMissingProperties: true,
      });

      next();
    },
    (req, res) => {
      console.log(1);
      res.send('hello3');
    }
  );

export default router;
