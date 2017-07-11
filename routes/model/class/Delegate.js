/**
 * Created by depengli on 2017/7/5.
 */
var Delegate =function(){
    //如果需要定义该类对象的字段、方法等，需加上this关键字，否则就认为是该函数中的临时变量
    this.name = "";
    this.address = "";
    this.email = "";
    this.provice = "";
    this.city = "";
    this.content = "";
    //定义对象方法
    this.show=function(){
    };
};

//导出Student类，使其他js文件可以通过require方法类加载该Student模块
module.exports=Delegate;