/**
 * Created by depengli on 2017/7/5.
 */
//在nodejs中，类型定义就像定义函数一样，其实该函数就是Student类的构造函数
var ImageInfo =function(){
    //如果需要定义该类对象的字段、方法等，需加上this关键字，否则就认为是该函数中的临时变量
    this.discribe = "";
    this.path = "";
    this.forId = "";
    //定义对象方法
    this.show=function(){

    };
};

//导出Student类，使其他js文件可以通过require方法类加载该Student模块
module.exports=ImageInfo;