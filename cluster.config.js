module.exports = {
    apps : [{
        name   : `jenkins_test`,
        script : "./src/app.ts",
        instances: 1,
        exec_mode: 'cluster',
        wait_ready: true,
        listen_timeout: 50000,
        kill_timeout: 30000,
        interpreter: './node_modules/.bin/ts-node'
    }]
}