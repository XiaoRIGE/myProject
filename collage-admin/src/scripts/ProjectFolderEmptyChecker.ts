import fs from 'fs';

console.log(
  '[script - ProjectFolderEmptyChecker]:',
  '开始执行项目关键文件夹存在性检测...'
);

fs.mkdir(
  './src/components/global',
  { recursive: true },
  (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error('[script - ProjectFolderEmptyChecker]:', '执行失败！');
      err;
    }
  }
);

fs.mkdir(
  './src/request/api/model',
  { recursive: true },
  (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error('[script - ProjectFolderEmptyChecker]:', '执行失败！');
      err;
    }
  }
);

fs.mkdir(
  './src/request/api/presenter',
  { recursive: true },
  (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error('[script - ProjectFolderEmptyChecker]:', '执行失败！');
      err;
    }
  }
);

console.log('[script - ProjectFolderEmptyChecker]:', '执行成功！');
