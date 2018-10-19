// shitty first draft 
// this file: I'm tracking publishers I know and trying to build some kind of function generator that will do different stuff based on publisher. 
// ToDo: ask a friend and speed it up 
// progress here: check the logs and you'll see it will either send a new publihser to airtbale or 
var pearson, cengage, sage, macmillan, mcgraw, oxford



pearson = function(content){
  //request url and callback
  console.log("the pearson function has been called")
  
  console.log(content)
};
cengage = function(content){
  //call cengage
  //request url and callback
  console.log("the cengage function has been called")
};
sage = function(content){
  //call cengage
  //request url and callback
  console.log("the sage function has been called")
};
macmillan = function(content){
  //call macmillan
  //request url and callback
  console.log("the macmillan function has been called")
};

mcgraw = function(){
  
}
oxford = function(){
  
}






var knownImprint = {
  addison:{publisher: pearson, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  benjamin:{publisher: pearson, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  pearson:{publisher: pearson, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  prentice:{publisher: pearson, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  brooks:{publisher: cengage, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  thomson:{publisher: cengage, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  cengage:{publisher: cengage, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  sage:{publisher: sage, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  macmillan:{publisher: macmillan, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  mcgraw:{publisher: mcgraw, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }},
  oxford:{publisher: oxford, resources:{rep: "findmyrep url", resources: "resources url", author: "author info", TOC: "TOC info" }}
}

module.exports = knownImprint
