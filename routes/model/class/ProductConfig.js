/**
 * Created by depengli on 2017/7/5.
 */
var ProductConfig =function(){
    //如果需要定义该类对象的字段、方法等，需加上this关键字，否则就认为是该函数中的临时变量
    this.type = "";
    this.subType = "";
    this.name = "";
    this.config = {};
    //定义对象方法
    this.show=function(){

    };
};

//ProductConfig，使其他js文件可以通过require方法类加载该Student模块
module.exports=ProductConfig;