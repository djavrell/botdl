function cleaner() {
  this.re = /([\w\.\-(%.{2})]*\.(mkv|mp4))$/g
  this.reg = {};
}

cleaner.prototype.show = function() {
  for (let exp in this.reg) {
    console.log(`${exp} => '${this.reg[exp]}'`);
  }
};

cleaner.prototype.registerExpression = function(exp, target) {
  this.reg[exp] = {
    exp,
    target
  };
};

cleaner.prototype.cleanName = function(name) {
  const ext = name.split(/\.(mkv|mp4)$/);
  ext.pop();

  for (let re in this.reg) {
    ext[0] = ext[0].replace(this.reg[re].exp, this.reg[re].target);
  }

  return ext.join('.');
}

cleaner.prototype.getName = function(link) {
  return this.cleanName(link.split(this.re)[1]);
};

module.exports = {
  cleaner,
}