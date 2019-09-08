
export var levelArr = [{
  level:0,
  text:'初出茅庐'
},{
  level:100,
  text:'足智多谋'
},{
  level:200,
  text:'真知灼见'
},{
  level:300,
  text:'明察秋毫'
},{
  level:400,
  text:'神机妙算'
},{
  level:500,
  text:'诸葛再世'
}]

export function formatLevel(level){
  var levelNum = Math.floor(level /100);
  var remain = level % 100;
  return {levelNum,remain};
}