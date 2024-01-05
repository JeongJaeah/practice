const oracledb = require('oracledb');
const localDbConfig = require('./dbconfig')

const ODB_CONFIG = {
  HOMEDEVUSER: 'homedev',
  HOMEDEVPWD: 'homedev123',
  HOMEDEVTNS:
    '(DESCRIPTION = \n' +
    '   (LOAD_BALANCE=ON)(FAIL_OVER=ON)\n' +
    '   (ADDRESS = (PROTOCOL = TCP)(HOST = 172.18.240.71)(PORT = 3521))\n' +
    '   (CONNECT_DATA =\n' +
    '       (FAILOVER_MODE=\n' +
    '           (TYPE=select)\n' +
    '           (METHOD=basic)\n' +
    '       )\n' +
    '     (SERVER = DEDICATED)\n' +
    '     (SERVICE_NAME = HOMEDEV)\n' +
    '   )\n' +
    ' )',
};

const sshConfig = {
  username: 'pcityadm',
  password: 'paradise12!@#',
  host: '접속할 리눅스주소10.153.10.165',
  port: 12,  //접속할 리눅스ssh포트
  dstHost: '172.18.240.71',  //최종목적지(내가 접속 할 데이터베이스)
  dstPort: 3521,        //최종목적지에서 사용할 포트(내가 접속 할 데이터베이스 포트)
  localPort: 22000       //ssh가 접속후 사용할 가상포트번호
}



const createPools = async () => {
  // const location = 'local';
  let location = 'pcity';
  console.log(process.env.DYLD_LIBRARY_PATH)
  const clientOpts = { libDir: '~/Applications/instantclient_12_1' };
  await oracledb.initOracleClient(clientOpts)

  const HOME_POOL = await oracledb.createPool({
    // password: ODB_CONFIG.HOMEDEVPWD,
    // connectString: ODB_CONFIG.HOMEDEVTNS,
    user: location === 'local' ? 'nya' : ODB_CONFIG.HOMEDEVUSER,
    password: location === 'local' ? '1234' : ODB_CONFIG.HOMEDEVPWD,
    connectString: location === 'local' ? localDbConfig.connectString : ODB_CONFIG.HOMEDEVTNS,
    poolMin: 1,
    poolMax: 8,
    poolIncrement: 1,
  });

  return HOME_POOL;
};

module.exports = { createPools };