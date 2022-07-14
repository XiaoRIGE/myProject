const program = require('commander');
const { exec } = require('child_process');

program.version('0.0.1').description('aaa');
program
  .command('build')
  .description('run remote setup commands')
  .action(() => {
    const HBUILDERX_CLI_PATH = process.env.HBUILDERX_CLI_PATH;
    if (HBUILDERX_CLI_PATH === undefined) {
      throw new Error(
        '未找到 "HBUILDERX_CLI_PATH" 环境变量，请将 HbuilderX CLI 所在路径配置至该变量中'
      );
    }
    console.log('成功');
    exec('echo "The \\$HOME variable is $HOME"');
    // $HOME 变量在第一个实例中被转义，但在第二个实例中没

    exec(`${HBUILDERX_CLI_PATH} user info`, (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(stdout);
    });
  });

program.parse(process.argv);
