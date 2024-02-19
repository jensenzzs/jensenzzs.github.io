## 说明
此目录是为了解决依赖包在TS环境不可用问题

 - 在@type目录下新建以依赖包为名称的文件夹，例如"myLib"
 - 在对应依赖包文件夹下新建文件"index.d.ts"，内容为
   ```ts
   declare module "midicube"
   ```